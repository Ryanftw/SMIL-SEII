const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant.js");
const { firestore } = require("firebase-admin");

// exports.cf_checkIfUserExists = functions.https.onCall(checkIfUserExists); 

// async function checkIfUserExists(data, context) {
//     const userList = [];
//     const MAXRESULTS = 1000; 
//     try {
//       let result = await admin.auth().listUsers(MAXRESULTS);
//       userList.push(...result.users); // '...' spread operator (pushes each user one by one into the array.)
//       let nextPageToken = result.pageToken;
//       while (nextPageToken) {
//         result = await admin.auth().listUsers(MAXRESULTS, nextPageToken);
//         userList.push(...result.users);
//         nextPageToken = result.pageToken;
//       }
//       for(let i = 0; i < userList.length; i++) {
//         if(userList[i].email == data) {
//           return true; 
//         }
//       }
//       return false;  
//     } catch (e) {
//       if (Constant.DEV) console.log(e);
//       throw new functions.https.HttpsError("internal', 'CheckUser Failed");
//     }
//   }