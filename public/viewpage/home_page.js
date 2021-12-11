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
let audioMessageStart = 0;
let audioRef;
let messageLoop;
let pic1Loop;
let pic2Loop;
let audioLoop;
let textLoop;
let pic1Offset;
let pic2Offset;
let audioOffset;
let textOffset;


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
            <label for="audio-message-start" class="form-label">Start audio in message at (in seconds)</label>
            <input type="number" class="form-range" min="0" step="0.1" id="audio-message-start">
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

  document.getElementById("preview-message-button").addEventListener("click", async (e) => {
    e.preventDefault();
    this.messageLoop = setInterval( () => {

      this.pic1Offset = setTimeout(() => {
          // document.getElementById("message-preview-image-1").src = document.getElementById("image-1").src;
          document.getElementById("message-preview-image-1").style.display = 'inline-block';
          this.pic1Loop = setTimeout(()=>{
          document.getElementById("message-preview-image-1").style.display = 'none';
        }, this.pic1Duration * 1000)
      }, this.pic1Start * 1000);

      this.pic2Offset = setTimeout(() => {
          // document.getElementById("message-preview-image-2").src = document.getElementById("image-2").src;
          document.getElementById("message-preview-image-2").style.display = 'inline-block';
          this.pic2Loop = setTimeout(()=>{
          document.getElementById("message-preview-image-2").style.display = 'none';
        }, this.pic2Duration * 1000)
      }, this.pic2Start * 1000);

      this.audioOffset = setTimeout(() => {
          // document.getElementById("message-preview-audio").innerHTML += `<source src="${this.audioRef}" type="audio/mpeg">`;
          // document.getElementById("message-preview-audio").style.display = 'inline-block';
          document.getElementById("message-preview-audio").currentTime = this.audioStart;
          document.getElementById("message-preview-audio").play();
          this.audioLoop = setTimeout(()=>{
          // document.getElementById("message-preview-audio").currentTime = this.audioStart;
          document.getElementById("message-preview-audio").pause();
        }, this.audioDuration * 1000)
      }, this.audioMessageStart * 1000);

    }, this.messageDuration * 1000);
    Element.modalPreview.show();
  })
  
  document.getElementById("message-preview-dismiss-btn").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("message-preview-audio").pause();
    clearInterval(this.messageLoop);
    // clearInterval(this.pic2Loop);
    // clearInterval(this.pic1Loop);
    // clearInterval(this.audioLoop);
    clearTimeout(this.pic2Loop);
    clearTimeout(this.pic1Loop);
    clearTimeout(this.audioLoop);
    // clearInterval(this.textLoop);
    // clearTimeout(this.textOffset);
    clearTimeout(this.pic1Offset);
    clearTimeout(this.pic2Offset);
    clearTimeout(this.audioOffset);
    Element.modalPreview.hide();
  })

  document.getElementById("send-to").addEventListener("change", async (e) => {
    e.preventDefault();
    this.sendTo = e.target.value;
    const flag = await FirebaseController.checkIfUserExists(this.sendTo);
    console.log(flag);
    if(flag == false) {
      console.log("not exists");
      document.getElementById("form-send-to-error").innerHTML = "Invalid User. Please re-enter.";
      return; 
    } else {
      console.log("exists");
      document.getElementById("form-send-to-error").innerHTML = "";
    }
    console.log(this.sendTo);
  })

  document.getElementById("message-content").addEventListener("change", async (e) => {
    e.preventDefault();
    this.messageContent = e.target.value;
    console.log(this.messageContent);
  })

  document.getElementById("message-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    this.messageDuration = Number(e.target.value);
    console.log(this.messageDuration);
    document.getElementById("message-duration-label").innerText = `Message duration: ${this.messageDuration} seconds`
  })

  document.getElementById("add-image-button1").addEventListener("change", async (e) => {
    this.image1 = e.target.files[0];
    console.log(e);

    if(!this.image1) {
      document.getElementById("image1").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.image1);
    reader.onload = () => {
      document.getElementById("image-1").src = reader.result;
      document.getElementById("message-preview-image-1").src = reader.result;
      document.getElementById("image-1-container").style.display = "inline-block";
    };
  })
  
  document.getElementById("add-image-button2").addEventListener("change", async (e) => {
    this.image2 = e.target.files[0];
    if(!this.image2) {
      document.getElementById("image-2").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.image2);
    reader.onload = () => {
      document.getElementById("image-2").src = reader.result;
      document.getElementById("message-preview-image-2").src = reader.result;
      document.getElementById("image-2-container").style.display = "inline-block";
    };
  })

  document.getElementById("add-audio-button").addEventListener("change", async (e) => {
    let audio = e.target.files[0];
    const reader = new FileReader();
    this.audioRef = await FirebaseController.uploadSmilAudio(audio);
    let audioJS = new Audio(audioRef); 
    reader.readAsArrayBuffer(audio);
    let duration; 
    reader.onload = (ev) => {
      getAudioDuration(ev.target.result);
      console.log(audioDuration);
      console.log(("Filename: '" + audio.name + "'"), ( "(" + ((Math.floor(audio.size/1024/1024*100))/100) + " MB)" ));
      audioLength = audioJS.duration;
      document.getElementById("my-audio").style.display = "inline-block";
      document.getElementById("my-audio").innerHTML += `<source src="${this.audioRef}" type="audio/mpeg">`;
      document.getElementById("message-preview-audio").innerHTML += `<source src="${this.audioRef}" type="audio/mpeg">`;
      document.getElementById("message-preview-audio").style.display = 'inline-block';
      document.getElementById("my-audio").play();
      document.getElementById("audio-timing").style.display = "inline-block"

    }
    console.log(audio);
  })

  document.getElementById("audio-start").addEventListener("change", async (e) => {
    e.preventDefault();
    this.audioStart = Number(e.target.value)
    console.log(this.audioStart);
  })

  document.getElementById("audio-message-start").addEventListener("change", async (e) => {
    e.preventDefault();
    this.audioMessageStart = Number(e.target.value)
    console.log(this.audioMessageStart);
  })

  document.getElementById("audio-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    this.audioDuration = Number(e.target.value);
    document.getElementById("audio-duration-label").innerText = `Audio duration: ${this.audioDuration} seconds`
    console.log(this.audioDuration);
  })

  document.getElementById("pic-1-start").addEventListener("change", async (e) => {
    e.preventDefault();
    this.pic1Start = Number(e.target.value)
    console.log(this.pic1Start);
  })

  document.getElementById("pic-1-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    this.pic1Duration = Number(e.target.value);
    document.getElementById("pic-1-duration-label").innerText = `Picture 1 duration: ${this.pic1Duration} seconds`
    console.log(this.pic1Duration);
  })

  document.getElementById("pic-2-start").addEventListener("change", async (e) => {
    e.preventDefault();
    this.pic2Start = Number(e.target.value)
    console.log(this.pic2Start);
  })

  document.getElementById("pic-2-duration").addEventListener("change", async (e) => {
    e.preventDefault();
    this.pic2Duration = Number(e.target.value);
    document.getElementById("pic-2-duration-label").innerText = `Picture 2 duration: ${this.pic2Duration} seconds`
    console.log(pic2Duration);
  })
}

function getAudioDuration(file) {
  var context = new window.AudioContext();
    context.decodeAudioData(file, function(buffer) {
      var source = context.createBufferSource();
        audioDuration = parseInt(buffer.duration); 
    });
}
