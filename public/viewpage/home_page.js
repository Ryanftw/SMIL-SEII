import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import { SmilSubAudio } from '../model/smil_sub_audio.js'
import { SmilSubPicture } from '../model/smil_sub_picture.js'
import { SmilSubMessage }  from '../model/smil_sub_message.js'
import { Smil } from "../model/smil.js";

var image1;
var image2; 
var sendTo;
var messageContent; 
var messageDuration = 0;
var audioStart = 0;
var audioDuration = 0;
var audioLength = 0;
var pic1Duration = 0;
var pic2Duration = 0;
var pic1Start = 0;
var pic2Start = 0;
var audioMessageStart = 0;
var msgContentDuration = 0;
var msgContentStart = 0;
var audioRef;
var messageLoop;
var pic1LoopStart;
var pic1LoopEnd;
var pic2LoopStart;
var pic2LoopEnd;
var audioLoopStart;
var audioLoopEnd;
var textLoopStart;
var textLoopEnd;
var smil;



export function addEventListeners() {
  Element.menuHome.addEventListener("click", async () => {
    history.pushState(null, null, Route.routePathnames.HOME);
    const label = Util.disableButton(Element.menuHome);
    await home_page();
    Util.enableButton(Element.menuHome, label);
  });
}

export async function home_page() {
  
  let html = `
  <div class="card">
    <h2 class="card-header">Compose a SMIL message</h2>
    <div class="card-body">
    
      <div class="row">
        <div class="col">
          <label for="send-to" class="form-label">Send to...</label>
          <input type="text" class="form-control" id="send-to" placeholder="name@example.com"/>
          <p id="form-send-to-error" class="my-error"></p>
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <label for="message-content" class="form-label">Message</label>
          <textarea class="form-control" id="message-content" rows="3" placeholder="Hello friend, just wanted to say hey and share this funny pic"></textarea>
          <div id="message-content-container" class="container" style="display: none;">
            <label for="message-content-start" class="form-label">Message content at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="message-content-start">
            <label id="message-content-duration-label" for="message-content-duration" class="form-label">Message Content duration: ${msgContentDuration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="message-content-duration">
            <div id="message-content-time-error" class="text-danger" style="display: none;">Please choose timings within the message's duration</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label class="form-label" for="add-image-button1">Add a picture</label>
          <input type="file" class="form-control" id="add-image-button1" value="upload">
          <div id="image-1-container" class="container" style="display: none;">
            <img id="image-1" src="" style="height: 215px; width: 15rem;">
            <label for="pic-1-start" class="form-label">Start Pic 1 at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="pic-1-start">
            <label id="pic-1-duration-label" for="pic-1-duration" class="form-label">Picture 1 duration: ${pic1Duration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="pic-1-duration">
            <div id="pic-1-time-error" class="text-danger" style="display: none;">Please choose timings within the message's duration</div>
          </div>
        </div>
        <div class="col">
          <label class="form-label" for="add-image-button2">Add a second picture</label>
          <input type="file" class="form-control" id="add-image-button2" value="upload">
          <div id="image-2-container" class="container" style="display: none;">
            <img id="image-2" src="" style="height: 215px; width: 15rem;">
            <label for="pic-2-start" class="form-label">Start Pic 2 at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="pic-2-start">
            <label id="pic-2-duration-label" for="pic-2-duration" class="form-label">Picture 2 duration: ${pic2Duration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="pic-2-duration">
            <div id="pic-2-time-error" class="text-danger" style="display: none;">Please choose timings within the message's duration</div>
          </div>
          
        </div>
        <div class="col">
          <label class="form-label" for="add-audio-button">Add audio</label>
          <input type="file" class="form-control" id="add-audio-button" value="upload"/>
          <div id="audio-timing" class="container" style="display: none;">
            <audio controls id="my-audio" style="width:17rem; display: none;">
              <source id="audio-source" src="" type="audio/mpeg">
            </audio>
            <label for="audio-start" class="form-label">Begin audio at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="audio-start">
            <label id="audio-duration-label" for="audio-duration" class="form-label">Audio duration: ${audioDuration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="audio-duration">
            <label for="audio-message-start" class="form-label">Start audio in message at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="audio-message-start">
            <div id="audio-time-error" class="text-danger" style="display: none;">Please choose timings within the message's duration</div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-3">
            <label id="message-duration-label" for="message-duration" class="form-label">Message duration: ${messageDuration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="message-duration"/>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <button id="preview-message-button" class="btn btn-outline-info">Preview Message</button>
        <button id="save-message-button" class="btn btn-outline-primary">Save Message</button>
        <button id="send-message-button" class="btn btn-outline-success">Send Message</button>
      </div>
    </div>
  </div>
  <br><br>
  `;

  Element.root.innerHTML = html;

  document.getElementById("save-message-button").addEventListener("click", async (e) => {
    // smil = new Smil({
    //   from: Auth.currentUser,
    //   sendTo: sendTo,
    //   subMessages: [],
    //   subAudios: [],
    //   subPictures: [],
    //   duration: messageDuration,
    //   timestamp: Date.now(),
    // });
    console.log(document.getElementById("image-2").src)
    let image1URL = await FirebaseController.uploadSmileImages(image1, image1.name);
    let image2URL = await FirebaseController.uploadSmileImages(image2, image2.name);


    const smilSubAudio = new SmilSubAudio({
      source: audioRef,
      startTime: audioMessageStart,
      duration: audioDuration,
      startAudioAt: audioStart
    });
    // smil.addAudio(smilSubAudio);
    const smilSubPic1 = new ASmilSubPicture({
      source: image1URL,
      startTime: pic1Start,
      duration: pic1Duration
    });
    // smil.addPictures(smilSubPic1);
    const smilSubPic2 = new SmilSubPicture({
        source: image2URL,
        startTime: pic2Start,
        duration: pic2Duration
    });
    // smil.addPictures(smilSubPic2);
    const smilMsg = new SmilSubMessage({
      messageContent: messageContent,
      startTime: msgContentStart,
      duration: msgContentDuration
    });
    // smil.addMessage(smilMsg);

    const subPicture1Id = await FirebaseController.uploadSmilSubPicture(smilSubPic1);
    const subPicture2Id = await FirebaseController.uploadSmilSubPicture(smilSubPic2);
    const subMsgId = await FirebaseController.uploadSmilSubMessage(smilMsg); 
    const subAudioId = await FirebaseController.uploadSubAudio(smilSubAudio); 
    console.log(subPicture1Id)
    console.log(subPicture1Id)
    console.log(subMsgId)
    console.log(subAudioId)
    const timestamp = Date.now();
    smil = new Smil({
      from: Auth.currentUser.email,
      sendTo: sendTo,
      subMsgId: subMsgId,
      subAudioId: subAudioId,
      subPicture1Id: subPicture1Id,
      subPicture2Id: subPicture2Id,
      duration: messageDuration,
      timestamp: timestamp,
    });

    console.log(smil);

    
    smil.id = await FirebaseController.uploadSmil(smil);
    console.log(smil.id);
  });

  document.getElementById("preview-message-button").addEventListener("click", async (e) => {
    e.preventDefault();
    preview(); 
    messageLoop = setInterval(preview, messageDuration * 1000);
    Element.modalPreview.show();
  })
  
  document.getElementById("message-preview-dismiss-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("message-preview-audio").pause();
    document.getElementById("message-preview-image-2").style.display = 'none';
    document.getElementById("message-preview-image-1").style.display = 'none';
    document.getElementById("message-preview-content").style.display = 'none';
    clearInterval(messageLoop);
    clearTimeout(audioLoopStart);
    clearTimeout(audioLoopEnd);
    clearTimeout(pic1LoopStart);
    clearTimeout(pic1LoopEnd);
    clearTimeout(pic2LoopStart);
    clearTimeout(pic2LoopEnd);
    clearTimeout(textLoopStart);
    clearTimeout(textLoopEnd);
    Element.modalPreview.hide();
  })

  document.getElementById("send-to").addEventListener("change", async (e) => {
    e.preventDefault();
    sendTo = e.target.value;
    // const flag = await FirebaseController.checkIfUserExists(sendTo);
    // console.log(flag);
    // if(flag == false) {
    //   console.log("not exists");
    //   document.getElementById("form-send-to-error").innerHTML = "Invalid User. Please re-enter.";
    //   return; 
    // } else {
    //   console.log("exists");
    //   document.getElementById("form-send-to-error").innerHTML = "";
    // }
    console.log(sendTo);
  })

  document.getElementById("message-content").addEventListener("change", async (e) => {
    e.preventDefault();
    messageContent = e.target.value;
    document.getElementById("message-preview-content").innerText = messageContent;
    document.getElementById('message-content-container').style.display = 'inline-block'
    console.log(messageContent);
  })

  document.getElementById("message-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    messageDuration = Number(e.target.value);
    console.log(messageDuration);
    document.getElementById("message-duration-label").innerText = `Message duration: ${messageDuration} seconds`
  })

  document.getElementById("add-image-button1").addEventListener("change", async (e) => {
    image1 = e.target.files[0];
    console.log(e);
    console.log(image1); 

    if(!image1) {
      document.getElementById("image1").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image1);
    reader.onload = () => {
      document.getElementById("image-1").src = reader.result;
      document.getElementById("message-preview-image-1").src = reader.result;
      document.getElementById("image-1-container").style.display = "inline-block";
    };
  })
  
  document.getElementById("add-image-button2").addEventListener("change", async (e) => {
    // if(!image1 || !pic1Duration || !pic1Start) {
    //   document.getElementById("no-image1-selected").innerHTML = "Please select image1 data first.";
    //   return; 
    // } else {
    //   document.getElementById("no-image1-selected").innerHTML = "";
    // }

    // document.getElementById("pic-2-start").min=(pic1Duration + pic1Start);
    
    image2 = e.target.files[0];
    if(!image2) {
      document.getElementById("image-2").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = () => {
      document.getElementById("image-2").src = reader.result;
      document.getElementById("message-preview-image-2").src = reader.result;
      document.getElementById("image-2-container").style.display = "inline-block";
    };
  })

  document.getElementById("add-audio-button").addEventListener("change", async (e) => {
    let audio = e.target.files[0];
    const reader = new FileReader();
    audioRef = await FirebaseController.uploadSmilAudio(audio, audio.name);
    let audioJS = new Audio(audioRef); 
    reader.readAsArrayBuffer(audio);
    let duration; 
    reader.onload = (ev) => {
      getAudioDuration(ev.target.result);
      console.log(audioDuration);
      console.log(("Filename: '" + audio.name + "'"), ( "(" + ((Math.floor(audio.size/1024/1024*100))/100) + " MB)" ));
      audioLength = audioJS.duration;
      document.getElementById("my-audio").style.display = "inline-block";
      document.getElementById("my-audio").innerHTML += `<source src="${audioRef}" type="audio/mpeg">`;
      document.getElementById("message-preview-audio").innerHTML += `<source src="${audioRef}" type="audio/mpeg">`;
      document.getElementById("message-preview-audio").style.display = 'inline-block';
      document.getElementById("my-audio").play();
      document.getElementById("audio-timing").style.display = "inline-block"

    }
    console.log(audio);
  })

  document.getElementById("audio-start").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + audioDuration < audioLength) {
      audioStart = Number(e.target.value)
      document.getElementById("audio-time-error").style.display = 'none'
    } else {
      document.getElementById("audio-time-error").style.display = 'inline-block'
    }
    console.log(audioStart);
  })

  document.getElementById("audio-message-start").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + audioDuration < messageDuration) {
      audioMessageStart = Number(e.target.value)
      document.getElementById("audio-time-error").style.display = 'none'
    } else {
      document.getElementById("audio-time-error").style.display = 'inline-block'
    }
    console.log(audioMessageStart);
  })

  document.getElementById("audio-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + audioMessageStart < messageDuration) {
      audioDuration = Number(e.target.value);
      document.getElementById("audio-duration-label").innerText = `Audio duration: ${audioDuration} seconds`
      document.getElementById("audio-time-error").style.display = 'none'

    } else {
      document.getElementById("audio-time-error").style.display = 'inline-block'
    }
    console.log(audioDuration);
  })

  document.getElementById("message-content-start").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + msgContentDuration < messageDuration) {
      msgContentStart = Number(e.target.value);
      document.getElementById("message-content-time-error").style.display = 'none'
    } else {
      document.getElementById("message-content-time-error").style.display = 'inline-block'
    }
    console.log(msgContentStart);
  })

  document.getElementById("message-content-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value);
    if(tempInput + msgContentStart < messageDuration) {
      msgContentDuration = Number(e.target.value);
      document.getElementById("message-content-duration-label").innerText = `Message content duration: ${msgContentDuration} seconds`
      document.getElementById("message-content-time-error").style.display = 'none'
    } else {
      document.getElementById("message-content-time-error").style.display = 'inline-block'
    }
    console.log(msgContentDuration);
  })

  document.getElementById("pic-1-start").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + pic1Duration < messageDuration) {
      pic1Start = Number(e.target.value);
      document.getElementById("pic-1-time-error").style.display = 'none'
    } else {
      document.getElementById("pic-1-time-error").style.display = 'inline-block'
    }
    console.log(pic1Start);
  })

  document.getElementById("pic-1-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value);
    if(tempInput + pic1Start < messageDuration) {
      pic1Duration = Number(e.target.value);
      document.getElementById("pic-1-duration-label").innerText = `Picture 1 duration: ${pic1Duration} seconds`
      document.getElementById("pic-1-time-error").style.display = 'none'
    } else {
      document.getElementById("pic-1-time-error").style.display = 'inline-block'
    }
    console.log(pic1Duration);
  })

  document.getElementById("pic-2-start").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value)
    if(tempInput + pic2Duration < messageDuration) {
      pic2Start = Number(e.target.value);
      document.getElementById("pic-2-time-error").style.display = 'none'
    } else {
      document.getElementById("pic-2-time-error").style.display = 'inline-block'
    }
    console.log(pic2Start);
  })

  document.getElementById("pic-2-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    let tempInput = Number(e.target.value);
    if(tempInput + pic2Start < messageDuration) {
      pic2Duration = Number(e.target.value);
      document.getElementById("pic-2-duration-label").innerText = `Picture 2 duration: ${pic2Duration} seconds`
    } else {
      document.getElementById("pic-2-time-error").style.display = 'inline-block'
    }
    console.log(pic2Duration);
  })
}

function getAudioDuration(file) {
  var context = new window.AudioContext();
    context.decodeAudioData(file, function(buffer) {
      var source = context.createBufferSource();
        audioLength = parseInt(buffer.duration); 
    });
}

function preview() {
  textLoopStart = setTimeout(() => {
    document.getElementById("message-preview-content").style.display = 'inline-block';
    textLoopEnd = setTimeout(() => {
    document.getElementById("message-preview-content").style.display = 'none';
    }, msgContentDuration * 1000);
  }, msgContentStart * 1000);
  
  pic1LoopStart = setTimeout(() => {
      document.getElementById("message-preview-image-1").style.display = 'inline-block';
      pic1LoopEnd = setTimeout(()=>{
      document.getElementById("message-preview-image-1").style.display = 'none';
    }, pic1Duration * 1000)
  }, pic1Start * 1000);

  pic2LoopStart = setTimeout(() => {
      document.getElementById("message-preview-image-2").style.display = 'inline-block';
      pic2LoopEnd = setTimeout(()=>{
        document.getElementById("message-preview-image-2").style.display = 'none';
    }, pic2Duration * 1000)
  }, pic2Start * 1000);

  audioLoopStart = setTimeout(() => {
      document.getElementById("message-preview-audio").currentTime = audioStart;
      document.getElementById("message-preview-audio").play();
      audioLoopEnd = setTimeout(()=>{
      document.getElementById("message-preview-audio").pause();
    }, audioDuration * 1000)
  }, audioMessageStart * 1000);
}
