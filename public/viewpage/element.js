// root element
export const root = document.getElementById("root");
// top menus
export const menuSignIn = document.getElementById("menu-signin");
export const menuInbox = document.getElementById("menu-inbox");
export const menuSent = document.getElementById("menu-sent");
export const menuDrafts = document.getElementById("menu-drafts");
export const menuHome = document.getElementById("menu-home");
export const menuSignOut = document.getElementById("menu-signout");
export const menuProfile = document.getElementById("menu-profile");
// forms
export const formSignIn = document.getElementById("form-signin");
export const formSignup = document.getElementById("form-signup")
export const formSignupPasswordError = document.getElementById("form-signup-password-error");

export const buttonSignup = document.getElementById("button-signup");

// modals
export const modalSignin = new bootstrap.Modal(
  document.getElementById("modal-signin"),
  { backdrop: "static" }
);

export const modalInfo = new bootstrap.Modal(
  document.getElementById("modal-info"),
  { backdrop: "static" }
);

export const modalInfoTitle = document.getElementById("modal-info-title");
export const modalInfoBody = document.getElementById("modal-info-body");
export const modalSignUp = new bootstrap.Modal(document.getElementById("modal-signup"), {backdrop: 'static'});
