/*Transition Sign Up/Sign In Form */
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const emailField = document.getElementById("emailField");
const title = document.getElementById("title");
const forgotPassword = document.getElementById("forgotPassword");
const submitBtn = documet.getElementById("submitBtn");

// Toggle between high lighted sign in/sign up
signinBtn.addEventListener("click", () => {
  emailField.style.maxHeight = "0px";
  title.innerHTML = "Sign In";
  signupBtn.classList.add("disable");
  signinBtn.classList.remove("disable");
  forgotPassword.style.maxHeight = "20px";
});

signupBtn.addEventListener("click", () => {
  emailField.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  signupBtn.classList.remove("disable");
  signinBtn.classList.add("disable");
  forgotPassword.style.maxHeight = "0px";
});

//code when submit button clicked

submitBtn.addEventListener("click", () => {
  // redirect to home api
  //error if submission is incomplete and remain on same page
});
