import { AccountInfo } from "../model/account_info.js";
import * as Constant from "../model/constant.js";
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