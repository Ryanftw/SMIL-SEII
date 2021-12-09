import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

let image1;
let image2; 
let audio; 

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
  <div class="card" style="width: 18rem; display: inline-block;">
    SMIL image 1:<input id="add-image-button1" type="file" value="upload"/>
    <div class="card-body">
      <img id="image-1" src="" style="height: 215px; width: 15rem;">
    </div>
  </div>
  <div class="card" style="width: 18rem; display: inline-block;">
    SMIL image 2:<input id="add-image-button2" type="file" value="upload"/>
    <div class="card-body">
      <img id="image-2" src="" style="height: 215px; width: 15rem;">
    </div>
  </div>
  <div class="card" style="width: 18rem; height: 280px; display: inline-block;">
    SMIL audio:<input id="add-audio-button" type="file" value="upload"/>
    <div class="card-body">
      <audio controls style="width:17rem;">
        <source id="audio-source" src="${audio}" type="audio/mpeg">
      </audio>
    </div>
  </div>
  <br><br>
  
  `;


  Element.root.innerHTML = html;

  document.getElementById("add-image-button1").addEventListener("change", async (e) => {
    image1 = e.target.files[0];
    console.log(e);

    if(!image1) {
      document.getElementById("image1").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image1);
    reader.onload = () => (document.getElementById("image-1").src = reader.result);
  })
  
  document.getElementById("add-image-button2").addEventListener("change", async (e) => {
    image2 = e.target.files[0];
    if(!image2) {
      document.getElementById("image-2").src = null; 
      return; 
    }
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = () => (document.getElementById("image-2").src = reader.result);
  })

  document.getElementById("add-audio-button").addEventListener("change", async (e) => {
    let audio = e.target.files[0];

    const reader = new FileReader();
    let audioRef = await FirebaseController.uploadSmilAudio(audio); 
    reader.readAsArrayBuffer(audio);
    // let audioRef = await FirebaseController.uploadSmilAudio(reader.result); 

    reader.onload = (ev) => {
      playAudioFile(ev.target.result);
      console.log(("Filename: '" + audio.name + "'"), ( "(" + ((Math.floor(audio.size/1024/1024*100))/100) + " MB)" ));
    }
    // reader.onload = () => (document.getElementsByTagName("source").src = reader.result);
    // reader.readAsDataURL(audio);
    console.log(audio);

    // reader.onload = () => (document.getElementById("audio-source").src = reader.result);
    // reader.readAsDataURL(audio);

    let myaudio = new Audio(audioRef);

    Element.root.innerHTML += `
    <br><br><br>
    <audio controls id="my-audio" style="width:17rem;">
      <source src="${audioRef}" type="audio/mpeg">
    </audio>
    `;
    myaudio.play();
    document.getElementById("my-audio").play();

  })

}

function playAudioFile(file) {
  var context = new window.AudioContext();
    context.decodeAudioData(file, function(buffer) {
      var source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = false;
        source.connect(context.destination);
        // source.start(0); 
    });
}

