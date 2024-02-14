const {GoogleAuth} = require('google-auth-library');
const express = require("express")
const {authenticate} = require('@google-cloud/local-auth');
const path = require('path');


var app = express()
/**
 * This sample demonstrates passing a `credentials` object directly into the
 * `getClient` method.  This is useful if you're storing the fields required
 * in environment variables.  The original `client_email` and `private_key`
 * values are obtained from a service account credential file.
 */
//   const clientEmail = process.env.CLIENT_EMAIL;
//   const privateKey = process.env.PRIVATE_KEY;
//   if (!clientEmail || !privateKey) {
//     throw new Error(`
//       The CLIENT_EMAIL and PRIVATE_KEY environment variables are required for
//       this sample.
//     `);
//   }
const port = process.env.PORT || 5000;


app.get('/', async function(q,r){


    const localAuth = await authenticate({
        scopes: ['https://www.googleapis.com/auth/blogger'],
        keyfilePath: path.join(__dirname, './secrets.json'),
      });
      console.log('Tokens:', localAuth.credentials);

//     var admin = require("firebase-admin");
// var serviceAccount = require("./secrets.json");

// var test=  await admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// r.json({"data":test})
//     const auth  = new  GoogleAuth({
//         credentials: {
//           client_email: "firebase-adminsdk-xj9bz@fir-fire-14db9.iam.gserviceaccount.com",
//           private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNkg4pMV8nXKgc\nTpVDqmImXKOy2AxT5QCsP1Z9vcfzuPSaqD4suR7qXiHIfkGOSbU4PKjM9MBrxRZk\n/6Da+NQ6bTO5WNE2YEJNTE/FGjlG/prmYA8DDUbbJvVf0bNfk6dQenDPVH4LePK7\niVqWeQqVl7ZfXImGS8rsQ5ZiKA0HxaLQwyoAz0z0qSykD8Yq2CLoqjRJk8tBsiI2\nK/aAma046qWwdyU9dMc84wpxFHuFKsTK75vmO/Z6SMF9vclLN+Mipz1FXukOBgIE\n74fEWVPbcpX8ATbi8OgPBblQjz5Ps3jsfi/P1yrPKForVr8cYsNfBU990CI19Z4w\nN+XTn1aXAgMBAAECggEAM7vW/nzjUneaAw2vuMivTLIxrDd82rwd8Ds8XAafxHE+\ndZFznDO2WQr5e4hynQllptJ1NKc/qZ9+5EoExDasyktjIfj9Ja8R4Hwc8yCHW5uF\nhgaUoJL9yvdB9yxB9QKmr7UwoKzFz8NPauzFNGsfw8fbaKJUJcz7M3xK40brCJI7\nYMDE9mrzYCEjKd+4w0uwFHSFFVQ0elrHedIlOKfp4wUILv1rcvgjYnUClrcgQfQt\nAP6vreALhyufljlxadZUEIUN1sAJJZaJCq/rVQNp+GSc9I8/ovWHuDFs5ayA/PB1\ne+q97OidS/NiwCpYL4WoO4WQHYgugNQeVVM1PWZ14QKBgQD6T5YsMaKMPcn1q6GS\nqGszUvi6oj7iquQgFUZzNlKcCKgATjVbyV0DtFRpkxySMHh0qwap9X1rGH3mB+Ot\nqVO1REgLpLQLFVN8s1EdZmYhrKvUqDeOjT+V/4gLbNkoRvQUbBYm4o4y8H2ojj4v\nEivZ3hinRsyLX5IO29r+wPRmkQKBgQDSPiaN6QEb30xP/cWQLIlplVescW+L/kTE\ni2Grqk75jMljFxNqq/ZDLMlYrgK7A0NFaXjmErXMqb+zbqJIKO83dqNkC5VHJxDS\nMczDWqnPPBHIJ3hSE8Tt8xl0OYZUuDbDgRnyjMslVvcUth2SGzqQRDDpa5TfQwAY\nFa1/jIyOpwKBgGdzqS9OvE2V4/hjHP4OGXA25JHOKItp8arI4DsRwoa2lSi7KhZr\nXMQBLboMkQxieAZQAQsRaOpwTuhZbmIBz5TlSZl2UusZv02Ulvu9rIxSXxofBAco\nnZUS7Vk7fWzGFm6yVV1w2TB4cJbPYyf1LKZ4wluwSS15LFZzy0jq2pfhAoGBAIqa\n2sQX5tk/P4pE3aiNFBJ9mI1hQ47hlOiWk0+fOe2feW1QW0aqE/J5ZkyGe9pa7lCm\nlkPn9d710iIzP92ezwabumBMmp+MC7Tni/0Gmoi7K2XvT42c5umQqSlMe1kDEWeW\nh0q2s37sdHw9DAW02ckei7h3anA+NaOrNvSt7kRlAoGAFebtozNknIicmLwhyzR6\nSPYo9oFaG2eg/V8puQA0to047nR1XPzhq+Y9O4rdeDGyjOknNd0e+V8DSEkybFsb\nsD26F3PgFc5T9mUr1rO/IXvn/PdHM5/vvUKMxn7aUpzXpVPkPGDtrgG27e/VYNYA\nZamw7L1ZljFWRXe0NUV9JcA=\n-----END PRIVATE KEY-----\n",
//         },
//         scopes: 'https://www.googleapis.com/auth/cloud-platform',
//       });
    
//       const client = await auth.getClient();
//       console.log(client)
//     //   const projectId = await auth.getProjectId();
//     //   console.log(projectId);
//       const url = `https://dns.googleapis.com/dns/v1/projects/fir-fire-14db9`;
//       const res = await client.request({url});
//       console.log('DNS Info:');
//       console.log(res.data);
});
  
app.listen(port, () => console.log(`Server is running on port ${port}!!`));
