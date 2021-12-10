import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

let image1;
let image2; 
let sendTo;
let messageContent; 
let messageDuration = 0;
let audioStart = 0;
let audioDuration = 0;
let audioLength = 0;
let pic1Duration = 0;
let pic2Duration = 0;
let pic1Start = 0;
let pic2Start = 0;


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
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <label for="message-content" class="form-label">Message</label>
          <textarea class="form-control" id="message-content" rows="3" placeholder="Hello friend, just wanted to say hey and share this funny pic"></textarea>
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
          </div>
        </div>
        
        <div class="row">
          <div class="col-3">
            <label id="message-duration-label" for="message-duration" class="form-label">Message duration: ${messageDuration} seconds</label>
            <input type="range" class="form-range" min="0" max="30" step="0.1" id="message-duration">
          </div>
        </div>

      </div>
    </div>
  </div>
  <br><br>
  `;


  Element.root.innerHTML = html;

  document.getElementById("send-to").addEventListener("change", async (e) => {
    e.preventDefault();
    sendTo = e.target.value;
    console.log(sendTo);
  })

  document.getElementById("message-content").addEventListener("change", async (e) => {
    e.preventDefault();
    messageContent = e.target.value;
    console.log(messageContent);
  })

  document.getElementById("message-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    messageDuration = e.target.value;
    console.log(messageDuration);
    document.getElementById("message-duration-label").innerText = `Message duration: ${messageDuration} seconds`
  })

  document.getElementById("add-image-button1").addEventListener("change", async (e) => {
    image1 = e.target.files[0];
    console.log(e);

    if(!image1) {
      document.getElementById("image1").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image1);
    reader.onload = () => {
      document.getElementById("image-1").src = reader.result;
      document.getElementById("image-1-container").style.display = "inline-block";
    };
  })
  
  document.getElementById("add-image-button2").addEventListener("change", async (e) => {
    image2 = e.target.files[0];
    if(!image2) {
      document.getElementById("image-2").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = () => {
      document.getElementById("image-2").src = reader.result;
      document.getElementById("image-2-container").style.display = "inline-block";
    };
  })

  document.getElementById("add-audio-button").addEventListener("change", async (e) => {
    let audio = e.target.files[0];
    const reader = new FileReader();
    let audioRef = await FirebaseController.uploadSmilAudio(audio);
    let audioJS = new Audio(audioRef); 
    reader.readAsArrayBuffer(audio);
    reader.onload = (ev) => {
      console.log(("Filename: '" + audio.name + "'"), ( "(" + ((Math.floor(audio.size/1024/1024*100))/100) + " MB)" ));
      audioLength = audioJS.duration;
      document.getElementById("my-audio").style.display = "inline-block";
      document.getElementById("my-audio").innerHTML += `<source src="${audioRef}" type="audio/mpeg">`;
      document.getElementById("my-audio").play();
      document.getElementById("audio-timing").style.display = "inline-block"

    }
    console.log(audio);
  })

  document.getElementById("audio-start").addEventListener("change", async (e) => {
    e.preventDefault();
    audioStart = Number(e.target.value)
    console.log(audioStart);
  })

  document.getElementById("audio-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    audioDuration = Number(e.target.value);
    document.getElementById("audio-duration-label").innerText = `Audio duration: ${audioDuration} seconds`
    console.log(audioDuration);
  })

  document.getElementById("pic-1-start").addEventListener("change", async (e) => {
    e.preventDefault();
    pic1Start = Number(e.target.value)
    console.log(pic1Start);
  })

  document.getElementById("pic-1-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    pic1Duration = Number(e.target.value);
    document.getElementById("pic-1-duration-label").innerText = `Picture 1 duration: ${pic1Duration} seconds`
    console.log(pic1Duration);
  })

  document.getElementById("pic-2-start").addEventListener("change", async (e) => {
    e.preventDefault();
    pic2Start = Number(e.target.value)
    console.log(pic2Start);
  })

  document.getElementById("pic-2-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    pic2Duration = Number(e.target.value);
    document.getElementById("pic-2-duration-label").innerText = `Picture 2 duration: ${pic2Duration} seconds`
    console.log(pic2Duration);
  })
}


