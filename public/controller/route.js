import * as Home from "../viewpage/home_page.js";
import * as Profile from "../viewpage/profile_page.js";
import * as Inbox from "../viewpage/inbox_page.js"; 
import * as Drafts from "../viewpage/drafts.js"; 
import * as Sent from "../viewpage/sent.js"; 

export const routePathnames = {
  HOME: "/",
  PROFILE: "/profile",
  INBOX: "/inbox",
  DRAFTS: "/drafts",
  SENT: "/sent",
};

export const routes = [
  { pathname: routePathnames.HOME, page: Home.home_page },
  { pathname: routePathnames.PROFILE, page: Profile.profile_page },
  { pathname: routePathnames.INBOX, page: Inbox.inbox_page },
  { pathname: routePathnames.DRAFTS, page: Drafts.drafts_page },
  { pathname: routePathnames.SENT, page: Sent.sent_page },
];

export function routing(pathname, hash) {
  const route = routes.find((r) => r.pathname == pathname);
  if (route) route.page();
  else routes[0].page();
}
