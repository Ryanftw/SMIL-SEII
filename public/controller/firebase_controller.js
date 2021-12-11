import { AccountInfo } from "../model/account_info.js";
import * as Constant from "../model/constant.js";
import * as Message from "../model/smil_message.js";
import { Smil } from "../model/smil.js"; 

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function createUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function getAccountInfo(uid) {
  const doc = await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO).doc(uid).get(); 
  if(doc.exists) {
    let profile = new AccountInfo(doc.data());
    return profile; 
  } else {
    const defaultInfo = AccountInfo.instance(); 
    await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO).doc(uid).set(defaultInfo.serialize()); 
    return defaultInfo; 
  }
}

export async function updateAccountInfo(uid, updateInfo) {
  // updateInfo = {key: value}
  await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO).doc(uid).update(updateInfo); 
}

export async function uploadProfilePhoto(photoFile, imageName) {
  const ref = firebase.storage().ref().child(Constant.storageFolderNames.PROFILE_PHOTOS + imageName);
  const taskSnapShot = await ref.put(photoFile); 
  const photoURL = await taskSnapShot.ref.getDownloadURL(); 
  return photoURL; 
}

export async function uploadSmileImages(image1, name) {
  const ref = firebase.storage().ref().child(Constant.storageFolderNames.SMIL_IMAGES + name);
  const task = await ref.put(image1);
  const imageURL = await task.ref.getDownloadURL(); 
  return imageURL
}

export async function uploadSmilAudio(audio, audioname) {
  console.log(audio);
  const ref = firebase.storage().ref().child(Constant.storageFolderNames.SMIL_AUDIO + audioname);
  const task = await ref.put(audio); 
  const audioURL = await task.ref.getDownloadURL(); 
  return audioURL;
}

export async function uploadSmileMessage(smilMessage) {
  console.log(smilMessage);
  const ref = await firebase.firestore().collection(Constant.collectionNames.SMIL_MESSAGES).add(smilMessage.serialize());
  return ref.id; 
}

export async function uploadSmil(smilMsg) {
  console.log(smilMsg);
  const data = smilMsg.serialize();
  const ref = await firebase.firestore().collection(Constant.collectionNames.SMIL).add(smilMsg.serialize());
  return ref.id;
}

const cf_checkIfUserExists = firebase.functions().httpsCallable("cf_checkIfUserExists"); 
export async function checkIfUserExists(email) {
  const result = await cf_checkIfUserExists(email);
  if(result.data) return true; 
  return false; 
}

export async function getMessagesInbox(userid) {
  const snapshot = await firebase.firestore().collection(Constant.collectionNames.SMIL_MESSAGES)
  .where("to", "==", userid)
  .orderBy("timestamp")
  .get(); 
  let messages = []; 
  snapshot.forEach((doc) => {
    let msg = SmilMessage(doc.data());
    msg.docId = doc.id; 
    messages.push(msg); 
  })
  return messages; 
  
}

export async function getMessagesSent(userid) {
  const snapshot = await firebase.firestore().collection(Constant.collectionNames.SENT_MESSAGES)
  .where("from", "==", userid)
  .orderBy("timestamp")
  .get(); 
  let messages = []; 
  snapshot.forEach((doc) => {
    let msg = SmilMessage(doc.data());
    msg.docId = doc.id; 
    messages.push(msg); 
  })
  return messages; 
  
}

export async function getMessagesDrafts(userid) {
  const snapshot = await firebase.firestore().collection(Constant.collectionNames.DRAFTS)
  .where("from", "==", userid)
  .orderBy("timestamp")
  .get(); 
  let messages = []; 
  snapshot.forEach((doc) => {
    let msg = SmilMessage(doc.data());
    msg.docId = doc.id; 
    messages.push(msg); 
  })
  return messages; 
  
}

//=====

export async function uploadSubAudio(subAudio) {
  const ref = await firebase.firestore().collection(Constant.collectionNames.SUB_AUDIO).add(subAudio.serialize());
  return ref.id;
}

export async function uploadSmilSubMessage(smilMessage) {
  //i think it requires there to be text because otherwise, text is undefined idk
  const ref = await firebase.firestore().collection(Constant.collectionNames.SUB_MESSAGES).add(smilMessage.serialize());
  return ref.id; 
}

export async function uploadSmilSubPicture(subPic) {
  const ref = await firebase.firestore().collection(Constant.collectionNames.SUB_PICTURES).add(subPic.serialize());
  return ref.id; 
}

