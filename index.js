import { ChatOpenAI } from "langchain/chat_models/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import * as dotenv from 'dotenv';
dotenv.config();

import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { LLMChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";
import admin from 'firebase-admin'
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import express from "express";
var app = express()


admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.PROJECT_ID,   
    clientEmail: process.env.CLIENT_EMAIL,  
    privateKey: process.env.PRIVATE_KEY   
  })
});
const memory = new BufferMemory({
  memoryKey: "chatHistory",
});

const model = new ChatOpenAI({openAIApiKey:"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"});

const loader = new PDFLoader("textbook.pdf", {
  parsedItemSeparator: "",
});
const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splitDocs = await textSplitter.splitDocuments(docs);

const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new OpenAIEmbeddings({"openAIApiKey":"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"}));
console.log("split")
const retriever = vectorStore.asRetriever();

const serializeChatHistory = (chatHistory) => {
  if (Array.isArray(chatHistory)) {
    return chatHistory.join("\n");
  }
  console.log("split")
  return chatHistory;
};



const questionPrompt = PromptTemplate.fromTemplate(
  `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
CHAT HISTORY: {chatHistory}
----------------
CONTEXT: {context}
----------------
QUESTION: {question}
----------------
Helpful Answer:`
);

const questionGeneratorTemplate =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
----------------
CHAT HISTORY: {chatHistory}
----------------
FOLLOWUP QUESTION: {question}
----------------
Standalone question:`);



const handleProcessQuery = async (input) => {
  const chain = new LLMChain({
    llm: model,
    prompt: questionPrompt,
    outputParser: new StringOutputParser(),
  });

  const { text } = await chain.call({
    ...input,
    chatHistory: serializeChatHistory(input.chatHistory ?? ""),
  });

  await memory.saveContext(
    {
      human: input.question,
    },
    {
      ai: text,
    }
  );

  return text;
};



app.get("/", async function(req,res){


  const answerQuestionChain = RunnableSequence.from([
  {
    question: (input) => input.question,
  },
  {
    question: (previousStepResult) => previousStepResult.question,
    chatHistory: (previousStepResult) => serializeChatHistory(previousStepResult.chatHistory ?? ""),
    context: async (previousStepResult) => {

      const relevantDocs = await retriever.getRelevantDocuments(
        previousStepResult.question
      );
      const serialized = formatDocumentsAsString(relevantDocs);
      return serialized;
    },
  },
  handleProcessQuery,
  ]);

  const generateQuestionChain = RunnableSequence.from([
  {
    question: (input) => input.question,
    chatHistory: async () => {
      const memoryResult = await memory.loadMemoryVariables({});
      return serializeChatHistory(memoryResult.chatHistory ?? "");
    },
  },
  questionGeneratorTemplate,
  model,
  
  {
    question: (previousStepResult) =>
      previousStepResult.text,
  },
  answerQuestionChain,
  ]);

  const branch = RunnableBranch.from([
  [
    async () => {
      const memoryResult = await memory.loadMemoryVariables({});
      const isChatHistoryPresent = !memoryResult.chatHistory.length;

      return isChatHistoryPresent;
    },
    answerQuestionChain,
  ],
  [
    async () => {
      const memoryResult = await memory.loadMemoryVariables({});
      const isChatHistoryPresent =
        !!memoryResult.chatHistory && memoryResult.chatHistory.length;

      return isChatHistoryPresent;
    },
    generateQuestionChain,
  ],
  answerQuestionChain,
  ]);

  const fullChain = RunnableSequence.from([
  {
    question: (input) => input.question,
  },
  branch,
  ]);

  const resultOne = await fullChain.invoke({
  question:req.query.q,
  });

  res.send({"message":resultOne});
});


const port = process.env.PORT || 5000;  



  app.listen(port, () => console.log(`Server is running on port ${port}!!`));

