import * as Auth from "./controller/auth.js";
import * as Home from "./viewpage/home_page.js";
import * as Profile from "./viewpage/profile_page.js";
import * as Route from "./controller/route.js";
import * as Inbox from "./viewpage/inbox_page.js"; 
import * as Drafts from "./viewpage/drafts.js"; 
import * as Sent from "./viewpage/sent.js"; 

Inbox.addEventListeners(); 
Drafts.addEventListeners(); 
Sent.addEventListeners(); 
Auth.addEventListeners();
Home.addEventListeners();
Profile.addEventListeners();


window.onload = () => {
  const pathname = window.location.pathname;
  const hash = window.location.hash;
  Route.routing(pathname, hash);
};

window.addEventListener("popstate", (e) => {
  e.preventDefault();
  const pathname = e.target.location.pathname;
  const hash = e.target.location.hash;
  Route.routing(pathname, hash);
});
