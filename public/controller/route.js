import * as Home from "../viewpage/home_page.js";
import * as Profile from "../viewpage/profile_page.js";

export const routePathnames = {
  HOME: "/",
  PROFILE: "/profile",
};

export const routes = [
  { pathname: routePathnames.HOME, page: Home.home_page },
  { pathname: routePathnames.PROFILE, page: Profile.profile_page },
];

export function routing(pathname, hash) {
  const route = routes.find((r) => r.pathname == pathname);
  if (route) route.page();
  else routes[0].page();
}
