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
  
  let html = `
    Inbox html goes here. 
  `;

  Element.root.innerHTML = html;

}

