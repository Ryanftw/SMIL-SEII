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
          <img id="image-1" src="" style="height: 215px; width: 15rem; display: none;">
        </div>
        <div class="col">
          <label class="form-label" for="add-image-button2">Add a second picture</label>
          <input type="file" class="form-control" id="add-image-button2" value="upload">
          <img id="image-2" src="" style="height: 215px; width: 15rem; display: none;">
        </div>
        <div class="col">
          <label class="form-label" for="add-audio-button">Add audio</label>
          <input type="file" class="form-control" id="add-audio-button" value="upload"/>
          <audio controls id="my-audio" style="width:17rem; display: none;">
            <source id="audio-source" src="" type="audio/mpeg">
          </audio>
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
      document.getElementById("image-1").style.display = "inline-block";
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
      document.getElementById("image-2").style.display = "inline-block";
    };
  })

  document.getElementById("add-audio-button").addEventListener("change", async (e) => {
    let audio = e.target.files[0];

    const reader = new FileReader();
    let audioRef = await FirebaseController.uploadSmilAudio(audio); 
    reader.readAsArrayBuffer(audio);
    reader.onload = (ev) => {
      console.log(("Filename: '" + audio.name + "'"), ( "(" + ((Math.floor(audio.size/1024/1024*100))/100) + " MB)" ));
      document.getElementById("my-audio").style.display = "inline-block";
      document.getElementById("my-audio").innerHTML += `<source src="${audioRef}" type="audio/mpeg">`;
      document.getElementById("my-audio").play();
    }
    console.log(audio);

  })

}

