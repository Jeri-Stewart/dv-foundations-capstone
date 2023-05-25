/*Transition Sign Up/Sign In Form */
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const emailInput = document.getElementById("email");
const usernameInput = document.querySelector("#username");
const usernameField = document.querySelector(".input-field");
const passwordInput = document.querySelector("#password");
const title = document.getElementById("title");
const forgotPassword = document.getElementById("forgotPassword");
const submitBtn = document.getElementById("submitBtn");
const form = document.querySelector("form");
const flashMessage = document.querySelector(".success-message");

// Switch between highlighted sign in/sign up
signinBtn.addEventListener("click", () => {
  usernameInput.style.maxHeight = "0px";
  usernameField.style.maxHeight = "0px";
  title.innerHTML = "Sign In";
  signupBtn.classList.add("disable");
  signinBtn.classList.remove("disable");
  forgotPassword.style.maxHeight = "20px";
});

signupBtn.addEventListener("click", () => {
  usernameInput.style.maxHeight = "60px";
  usernameField.style.maxHeight = "60px";
  title.innerHTML = "Sign Up";
  signupBtn.classList.remove("disable");
  signinBtn.classList.add("disable");
  forgotPassword.style.maxHeight = "0px";
  if (flashMessage) {
    flashMessage.remove();
  }
});

// Code when submit button clicked
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  if (title.innerHTML === "Sign In") {
    try {
      const res = await axios.post("/", {
        username: "",
        email,
        password,
      });
      forgotPassword.addEventListener("click", () => {
        e.preventDefault;
        alert(`Your Password is ${password}`);
      });
      console.log(res.data);
      form.reset();
      //redirect to home page
      window.location.href = "/user/home/";
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const res = await axios.post("/", {
        username,
        email,
        password,
      });
      alert("Sign Up Successful");
      console.log(res.data);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  }
});
