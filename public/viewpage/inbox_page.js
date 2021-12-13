import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js"
import { home_page } from "./home_page.js";
  
var subAudio;
var subMsg;
var subPic1;
var subPic2;
var messageLoop;
var wasPlaying = false;
var audioCurrentTime;
var duration;
var seconds = 0;

export function addEventListeners() {
  Element.menuInbox.addEventListener("click", async () => {
    history.pushState(null, null, Route.routePathnames.INBOX);
    const label = Util.disableButton(Element.menuInbox);
    await inbox_page();
    Util.enableButton(Element.menuInbox, label);
  });

  document.getElementById("message-preview-dismiss-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("message-preview-audio").src = "";
    document.getElementById("message-preview-audio").pause();
    // document.getElementById("playback-source").remove();
    document.getElementById("message-preview-pause-btn").style.display = 'none';
    document.getElementById("message-preview-play-btn").style.display = 'none';
    document.getElementById("message-preview-image-2").style.display = 'none';
    document.getElementById("message-preview-image-1").style.display = 'none';
    document.getElementById("message-preview-content").style.display = 'none';

    messageLoop.clear();
    seconds = 0;
  });

  document.getElementById("message-preview-pause-btn").addEventListener("click", (e) => {
    e.preventDefault();
    wasPlaying = !document.getElementById("message-preview-audio").paused;
    if(wasPlaying) document.getElementById("message-preview-audio").pause();
    audioCurrentTime = document.getElementById("message-preview-audio").currentTime;
    messageLoop.pause();
  });

  document.getElementById("message-preview-play-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("message-preview-audio").currentTime = audioCurrentTime;
    if(wasPlaying) document.getElementById("message-preview-audio").play();
    messageLoop.resume()
  });

}

export async function inbox_page() {

  let messages = await FirebaseController.getMessagesInbox(Auth.currentUser.email); 
  
  let html = `
  <table class="table">
  <thead>
    <tr>
      <th scope="col">View Message</th>
      <th scop="col">Edit Message</th>
      <th scope="col">Sent From</th>
      <th scope="col">Message Duration</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
  `;

  for(let i = 0; i < messages.length; i++) {
    html += buildMessageView(messages[i], i);
  }

  Element.root.innerHTML = html;

  const viewButtons = document.getElementsByClassName("form-view-message");
  for(let i = 0; i < viewButtons.length; i++) {
    viewButtons[i].addEventListener('click', (e) => {
      e.preventDefault();
      showMessage(messages[i]);
    })
  }

  const editButtons = document.getElementsByClassName("form-edit-message");
  for(let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener('click', async (e) => {
      e.preventDefault();
      await editMessage(messages[i]);
    })
  }


}

function buildMessageView(message, i) {
  return ` 
  <tr>
    <td>
      <form class="form-view-message" method="post">
        <input type="hidden" name="index" value="${i}">
        <button type="submit" class="btn btn-outline-primary">View</button>
      </form>
    </td>
    <td>
      <form class="form-edit-message" method="post">
        <input type="hidden" name="index" value="${i}">
        <button type="submit" class="btn btn-outline-primary">Edit</button>
      </form>
    </td>
    <td>${message.from}</td>
    <td>${message.duration}</td>
    <td>${Date(message.timestamp)}</td>
  </tr>
  `;
}

async function showMessage(message) {
  duration = message.duration;
  if(message.subAudioId) {
    subAudio = await FirebaseController.getSubAudio(message.subAudioId);
    document.getElementById("message-preview-audio").src = subAudio.source;
    document.getElementById("message-preview-audio").style.display = 'inline-block';
  }
  if(message.subMsgId) {
    subMsg = await FirebaseController.getSubMsg(message.subMsgId);
    document.getElementById("message-preview-content").innerText = subMsg.messageContent;
  }
  if(message.subPicture1Id) {
    subPic1 = await FirebaseController.getSubPic(message.subPicture1Id);
    document.getElementById("message-preview-image-1").src = subPic1.source;
  }
  if(message.subPicture2Id) {
    subPic2 = await FirebaseController.getSubPic(message.subPicture2Id);
    document.getElementById("message-preview-image-2").src = subPic2.source;
  }
  document.getElementById("message-preview-pause-btn").style.display = 'inline-block';
  document.getElementById("message-preview-play-btn").style.display = 'inline-block';
  messageLoop = new IntervalTimer(playMessage2, 100);
  Element.modalPreview.show()
}

function playMessage2() {
  if(subMsg.startTime * 1000 === seconds) {
    document.getElementById("message-preview-content").style.display = 'inline-block';
  }
  if((subMsg.duration + subMsg.startTime) * 1000 === seconds) {
    document.getElementById("message-preview-content").style.display = 'none';
  }
  if(subPic1.startTime * 1000 === seconds) {
    document.getElementById("message-preview-image-1").style.display = 'inline-block';
  }
  if((subPic1.startTime + subPic1.duration) * 1000 == seconds) {
    document.getElementById("message-preview-image-1").style.display = 'none';
  }
  if(subPic2.startTime  * 1000 === seconds) {
    document.getElementById("message-preview-image-2").style.display = 'inline-block';
  }
  if((subPic2.startTime + subPic2.duration) * 1000 === seconds) {
    document.getElementById("message-preview-image-2").style.display = 'none';
  }
  if(subAudio.startTime * 1000 === seconds) {
    document.getElementById("message-preview-audio").currentTime = subAudio.startAudioAt;
    document.getElementById("message-preview-audio").play();
  }
  if((subAudio.startTime + subAudio.duration) * 1000 === seconds) {
    document.getElementById("message-preview-audio").pause();
  }
  if(seconds === duration * 1000) {
    seconds = 0;
  }
  else{
    seconds += 100;
  }
  
}

function IntervalTimer(callback, delay) {
  var timerId, start, remaining = delay;

  this.clear = function() {
    window.clearTimeout(timerId);
    remaining = delay;
  }

  this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
  };

  var resume = function() {
      start = new Date();
      timerId = window.setTimeout(function() {
          remaining = delay;
          resume();
          callback();
      }, remaining);
  };

  this.resume = resume;

  this.resume();
}

async function editMessage(message) {
  
  duration = message.duration;
  if(message.subAudioId) {
    subAudio = await FirebaseController.getSubAudio(message.subAudioId);
  }
  if(message.subMsgId) {
    subMsg = await FirebaseController.getSubMsg(message.subMsgId);
  }
  if(message.subPicture1Id) {
    subPic1 = await FirebaseController.getSubPic(message.subPicture1Id);
  }
  if(message.subPicture2Id) {
    subPic2 = await FirebaseController.getSubPic(message.subPicture2Id);
  }
  history.pushState(null, null, Route.routePathnames.HOME);
  await home_page(message, subMsg, subAudio, subPic1, subPic2); 
  
}