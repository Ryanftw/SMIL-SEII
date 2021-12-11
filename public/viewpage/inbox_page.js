import * as Element from "./element.js";
import * as Route from "../controller/route.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

export function addEventListeners() {
  Element.menuInbox.addEventListener("click", async () => {
    history.pushState(null, null, Route.routePathnames.INBOX);
    const label = Util.disableButton(Element.menuInbox);
    await inbox_page();
    Util.enableButton(Element.menuInbox, label);
  });
}

export async function inbox_page() {

  let messages = await FirebaseController.getMessagesInbox(Auth.currentUser.uid); 
  
  let html = `
  <table class="table">
  <thead>
    <tr>
      <th scope="col" width="35%">Review</th>
      <th scope="col">User</th>
      <th scope="col">Stars</th>
      <th scope="col">Review Date</th>
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

}

function buildMessageView(message, i) {
  return ` 
    <td>
      <form class="form-view-message" method="post">
        <input type="hidden" name="index" value="${i}">
        <button type="submit" class="btn btn-outline-primary">View</button>
      </form>
    </td?
    <td>${message.from}</td>
    <td>${message.textcontent}</td>
    <td>${message.timesamp}</td>
  `;
}