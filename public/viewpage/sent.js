import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuSent.addEventListener("click", async () => {
    history.pushState(null, null, Route.routePathnames.SENT);
    const label = Util.disableButton(Element.menuSent);
    await sent_page();
    Util.enableButton(Element.menuSent, label);
  });
}

export async function sent_page() {

  let messages = await FirebaseController.getMessagesSent(Auth.currentUser.uid); 
  
  let html = `
  <table class="table">
  <thead>
    <tr>
      <th scope="col" width="35%">View Message</th>
      <th scope="col">Sent From</th>
      <th scope="col">Message Text</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
  `;

  for(let i = 0; i < messages.length; i++) {
    html += buildMessageView(messages[i], i);
  }

  messages.forEach((message) => {
    html += buildMessageView(message); 
  })

  Element.root.innerHTML = html;

  const viewButtons = document.getElementsByClassName("form-view-message");
  for(let i = 0; i < viewButtons.length; i++) {
    viewButtons[i].addEventListener('submit', (e) => {
      showMessage(messages[e.target.index.value]);
    })
  }

}

function buildMessageView(message, i) {
  return ` 
    <td>
      <form class="form-view-message" method="post">
        <input type="hidden" name="index" value="${i}">
        <button type="submit" class="btn btn-outline-primary">View</button>
      </form>
    </td>
    <td>${message.from}</td>
    <td>${message.textcontent}</td>
    <td>${message.timesamp}</td>
  `;
}

function showMessage(message) {
  //show message player here
}