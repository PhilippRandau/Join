let disclaimerShowAgain = true
let disclaimerUnderstood = false


/**
 * Initializes login by calling the loadParms() and loadUsers() functions.
 */
function initLogin() {
  loadParms();
  loadUsers();
}


/**
 * Initializes index page by calling the animateImage(), initLogin(), and initLocalLogin() functions.
 */
function initIndex() {
  animateImage();
  initLogin()
  initLocalLogin();
}


/**
 * Handles the user's acceptance of the disclaimer by hiding the disclaimer container and updating the 
 * `disclaimerUnderstood` and `disclaimerShowAgain` variables in local storage.
 */
function understoodDisclaimer() {
  let checkbox = document.getElementById('disclaimerCheck').checked
  if (checkbox == true) {
    disclaimerShowAgain = false
    localStorage.setItem('disclaimerUnderstood', true)
    localStorage.setItem('dontShowAgain', false)
  }
  disclaimerUnderstood = true
  let text = document.getElementById('disclaimerConatiner')
  text.classList.add('d-none')
}


/**
 * Animates the join entrance and logo elements by adding and removing classes.
 */
function animateImage() {
  loginLogo.classList.add('d-none')
  let svg = document.getElementById('joinEntrance');
  svg.classList.add('slide-out-tl');
  let bg = document.getElementById('joinEntranceBg');
  bg.classList.add('title-bg-hide');
  setTimeout(() => {
    // svg.classList.add('d-none');
    bg.classList.add('d-none');
    loginLogo.classList.remove('d-none')
  }, 1900);
}


/**
 * Checks if the user has understood the disclaimer and if they have not, displays an error message.
 * @returns {boolean} Returns `true` if the user has checked the disclaimer checkbox and has understood the disclaimer, `false` otherwise.
 * @example
 * // Returns true if the disclaimer is understood or if the user has previously indicated they do not want to see the message again
 * const result = proofDisclaimer();
 */
function proofDisclaimer() {
  let storage = localStorage.getItem('dontShowAgain')
  if (storage === "false") {
    return true
  }
  if (disclaimerUnderstood == false) {
    let falseInputText = document.getElementById('msgBoxUnderstood')
    falseInputText.classList.remove('d-none')
    return false
  } else {
    return true
  }
}


/**
 * Loads URL parameters and displays a message if it exists. 
 * Calls the `loadSecondParms()` function.
 */
function loadParms() {
  const urlParams = new URLSearchParams(window.location.search)
  const msg = urlParams.get('msg')
  if (msg) {
    msgBox.innerHTML = msg;
  } else {
    document.getElementById('msgBox').classList.add('d-none')
  }
  loadSecondParms()
}


/**
 * Loads second URL parameters and calls `setSecondParms()` if `msg2` exists.
 * If not, hides the `msgBox2` element.
 */
function loadSecondParms() {
  const urlParams2 = new URLSearchParams(window.location.search)
  const msg2 = urlParams2.get('msg2')
  if (msg2) {
    setSecondParms(msg2)
  } else try {
    document.getElementById('msgBox2').classList.add('d-none')
  } catch (error) {
    // console.error("no parameters");
  }
}


/**
 * Sets the message and input field value and placeholder of a password input after a 100ms timeout.
 * @param {string} msg2 - The message to display in the message box.
 */
function setSecondParms(msg2) {
  setTimeout(() => {
    passwordInput = document.getElementById("password");
    msgBox2.innerHTML = msg2;
    passwordInput.value = ""
    passwordInput.placeholder = "Ups! Try again"
  }, 100);
}


/**
 * Shows or hides a disclaimer text based on whether a "dontShowAgain" flag is set in local storage.
 */
async function proofDisclaimerAgain() {
  let dontShow = localStorage.getItem("dontShowAgain");
  if (dontShow === "false") {
    let text = document.getElementById('disclaimerConatiner')
    text.classList.add('d-none')
  }
  if (!dontShow) {
    let text = document.getElementById('disclaimerConatiner')
    text.classList.remove('d-none')
  }
}


/**
 * Loads the local disclaimer and user remember preferences on page load.
 */
function initLocalLogin() {
  loadLocalDisclaimer()
  loadLocalRememberUser()
}


/**
 * Sets the email and password fields based on whether the "checkbox" item in localStorage is present and has a value.
 */
function loadLocalRememberUser() {
  const rmCheck = document.getElementById("rememberMe"),
    emailInput = document.getElementById("email");
  passwordInput = document.getElementById("password");
  if (localStorage.checkbox && localStorage.checkbox && localStorage.checkbox !== "") {
    rmCheck.setAttribute("checked", "checked");
    emailInput.value = localStorage.email;
    passwordInput.value = localStorage.password;
  } else {
    rmCheck.removeAttribute("checked");
    emailInput.value = "";
    passwordInput.value = "";
  }
}


/**
 * Checks if the user has previously chosen to not see a disclaimer on the website. If the user has chosen to not see the disclaimer, the disclaimer container is hidden.
 */
function loadLocalDisclaimer() {
  if (localStorage.getItem('dontShowAgain') === 'true') {
    let text = document.getElementById('disclaimerConatiner');
    text.classList.add('d-none');
  }
}


/**
 * Downloads data from the server and checks if a user is currently logged in. If there is no user currently logged in, the user is redirected to the login/signup page.
 */
async function loadCurrentUser() {
  await downloadFromServer();
  let item = localStorage.getItem("currentUser");
  if (typeof item === "string") {
    currentUser = JSON.parse(item) || [];
  } else {
    currentUser = item;
  }
  if (currentUser == null) {
    window.location.href = "/index.html?msg=Please Log In or sign up."
  }
}


/**
 * Downloads data from the server and loads all users into an array called users.
 * @returns {Array} An array of all users
 */
async function loadUsers() {
  await downloadFromServer();
  let item = backend.getItem("users");
  if (typeof item === "string") {
    users = JSON.parse(item) || [];
  } else {
    users = item;
  }
  proofUsers();
}


/**
 * Checks if there are any users on the server. If there are no users, it sets the user as a guest.
 */
async function proofUsers() {
  if (users === null) {
    await setGuestUser();
  }
}


/**
* Adds a new user to the users array. It first loads all existing users, 
* then collects information for the new user (name, color, email, password), and creates a new user object. 
* If the email address is valid and the name is valid (a regex check is performed), then 
* the new user is saved to the server and the user is redirected to the index page.
*/
async function addUser() {
  await loadUsers();
  let newName = addUserName();
  let newColor = addUserColor();
  let newEmail = addUserEmail();
  let newInitialLetters = getInitialLetters(newName)
  let newPassword = document.getElementById("password").value;
  if (newEmail && proofName() === true && proofDisclaimer() == true) {
    await setNewUser(newName, newColor, newEmail, newPassword, newInitialLetters);
  } else {
    console.log();
    ("Überprüfe deine Angaben");
  }
}


/**
 * Takes in a name and returns the first letter of the first and last names as a string.
 * @param {string} newName - The name of the user.
 * @returns {string} The first letter of the first and last names as a string.
 */
function getInitialLetters(newName) {
  let initialFirstName = newName.split(" ")[0][0];
  let initialLastName = newName.split(" ")[1][0];
  let newInitialLetters = initialFirstName + initialLastName;
  return newInitialLetters
}


/**
 * Creates a new user object and saves it to the server.
 * @param {string} newName - The name of the user.
 * @param {string} newColor - The color of the user.
 * @param {string} newEmail - The email address of the user.
 * @param {string} newPassword - The password of the user.
 * @param {string} newInitialLetters - The initial letters of the user's name.
 */
async function setNewUser(newName, newColor, newEmail, newPassword, newInitialLetters) {
  let currentID = users.length - 1;
  let newID = currentID + 1;
  let userData = {
    name: newName,
    email: newEmail,
    password: newPassword,
    color: newColor,
    id: newID,
    contactCreatorID: newID,
    initialLetters: newInitialLetters,
    phone: '',
    contactID: newID,
  };
  await saveNewUser(userData);
  setTimeout(() => {
    window.location.href = "/Join/index.html?msg=Your regristration was successful";
  }, 500);
}


/**
 * Adds a new user object to the users array and saves it to the server.
 * @param {object} userData - The data of the user to be added.
 */
async function saveNewUser(userData) {
  users.push(userData);
  await backend.setItem("users", users);
}


/**
 * Logs a user in. It checks if the email and password match any user objects in the users array. 
 * If there is a match, the user is redirected to the summary page.
 */
async function login() {
  let email = setLoginEmail();
  if (email) {
    let password = setLoginPassword();
    let user = users.find((u) => u.email == email && u.password == password);
    if (user) {
      setCurrentUser(user);
      setTimeout(() => {
        window.location.href = "html/summary.html";
      }, 500);
    }
  } else {
    window.location.href = "/index.html?msg=Email not Found";
  }
}


/**
 * Checks if the user's name is valid (a regex check is performed). 
 * If the name is not valid, an error message is displayed and the function returns false.
 * @returns {boolean} True if the user's name is valid, false otherwise.
 */
function proofName() {
  let regName = /^[\wäöüÄÖÜ]+(?: [\wäöüÄÖÜ]+)+$/;
  let name = document.getElementById("name").value;
  if (!regName.test(name)) {
    document.getElementById("name").focus();
    document.getElementById("name").classList.add("falseInput");
    document.getElementById("falseName").classList.remove("d-none")
    return false;
  } else {
    document.getElementById("name").classList.remove("falseInput");
    document.getElementById("falseName").classList.add("d-none")
    return true;
  }
}


/**
 * Returns a random color from an array of color strings.
 * @returns {string} A random color string.
 */
function getRandomColor() {
  const colors = ["red", "orange", "chocolate", "green", "blue", "purple"]; // TODO: mehr variationen?
  return colors[Math.floor(Math.random() * colors.length)];
}


/**
 * Assigns a random color to a new user.
 * @returns {string} A randomly selected color string.
 */
function addUserColor() {
  newColor = getRandomColor();
  return newColor;
}


/**
 * Capitalizes the first letter of each word in the user's name entered in the input field.
 * @returns {string} The capitalized version of the user's name.
 */
function addUserName() {
  let name = document.getElementById("name").value.toLowerCase();
  let newName = name.replace(/\b\w/g, (l) => l.toUpperCase());
  return newName;
}


/**
 * Validates the user's inputted password by checking if it matches any password in the users array.
 * If a match is found, the function returns the inputted password, otherwise the user is redirected to the login page with an error message.
 * @returns {string|undefined} The inputted password if it matches any password in the users array, otherwise undefined.
 */
function setLoginPassword() {
  let inputPassword = document.getElementById("password").value;
  let user = users.find((u) => u.password == password.value);
  if (user) {
    return inputPassword;
  } else {
    window.location.href = "index.html?msg2=wrong password";
  }
}


/**
 * Saves the current user to local storage.
 * @param {object} user - The user object to be saved to local storage.
 */
function setCurrentUser(user) {
  currentUser.push(user);
  // console.log("user gefunden:", user);
  let userJSON = JSON.stringify(user);
  localStorage.setItem("currentUser", userJSON);
}


/**
 * Validates the user's inputted email by checking if it is in a valid format (using a regex) and if it matches any email in the users array.
 * If both conditions are met, the function returns the inputted email, otherwise it returns undefined.
 * @returns {string|undefined} The inputted email if it is valid and matches any email in the users array, otherwise undefined.
 */
function setLoginEmail() {
  let email = document.getElementById("email").value.toLowerCase();
  let newEmail = email.replace(/^\w/, (c) => c.toUpperCase());
  let emailFound = users.find((u) => u.email == newEmail);
  let emailRegex = getEmailRegEx();
  if (emailFound && emailRegex.test(newEmail)) {
    return newEmail;
  } else {
    // console.log("invalid email");
    return;
  }
}


/**
 * Validates the user's email by checking if it is in a valid format (using a regex).
 * If the email is valid, the function returns true, otherwise it displays an error message and returns false.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function proofEmail() {
  let regEmail = getEmailRegEx();
  let email = document.getElementById("email").value;
  if (!regEmail.test(email)) {
    document.getElementById("email").focus();
    document.getElementById("email").classList.add("falseInput");
    document.getElementById("falseEmail").classList.remove("d-none")
    return false;
  } else {
    document.getElementById("falseEmail").classList.add("d-none")
    document.getElementById("email").classList.remove("falseInput");
    return true;
  }
}


/**
 * Takes the email input from the signup form, capitalizes the first letter, 
 * checks if the email is valid using a regex check, and searches the users array to 
 * see if the email is already registered. If the email is valid and not already 
 * registered, the function returns the new email. Otherwise, it redirects the user to 
 * the signup page or runs the proofEmail() function.
 * @returns {string|undefined} The new email if it is valid and not already registered, 
 * otherwise undefined.
 */
function addUserEmail() {
  let email = document.getElementById("email").value.toLowerCase();
  let newEmail = email.replace(/^\w/, (c) => c.toUpperCase());
  let emailFound = users.find((u) => u.email == newEmail);
  let emailRegex = getEmailRegEx();
  if (!emailRegex.test(newEmail)) {
    proofEmail();
    return;
  }
  if (emailFound) {
    window.location.href =
      "signUp.html?msg=The email is already registered here";
    return;
  } else {
    return newEmail;
  }
}


/**
 * Checks if the "remember me" checkbox is checked and if there is email and password input. 
 * If both conditions are met, it saves the email, password, and checkbox value to local storage. 
 * Otherwise, it clears the local storage values.
 */
function lsRememberMe() {
  const rmCheck = document.getElementById("rememberMe"),
    emailInput = document.getElementById("email");
  passwordInput = document.getElementById("password");
  if (rmCheck.checked && emailInput.value && passwordInput.value !== "") {
    localStorage.email = emailInput.value;
    localStorage.password = passwordInput.value;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.email = "";
    localStorage.password = "";
    localStorage.checkbox = "";
  }
}


/**
 * Sets the email and password input fields to the values of the first user object in the  users array. 
 * This is used for a "login as guest" feature.
 */
function loginAsGuest() {
  let email = document.getElementById("email");
  email.value = users[0]["email"];
  let password = document.getElementById("password");
  password.value = users[0]["password"];
}


/**
 * Sets the users array to a single guest user object. 
 * This is used to initialize the users array if it is not already set.
 * @async
 */
async function setGuestUser() {
  let users = [
    {
      name: "Guest User",
      email: "Xxx@xxx.xx",
      password: "v67rR§F$",
      color: "Black",
      id: 0,
      contactCreatorID: 0,
      initialLetters: "GU",
      phone: '',
      contactID: 0,
    },
  ];
  await backend.setItem("users", users);
}


/**
 * Changes the background image of the password input field to a lock image to indicate that the password is hidden.
 */
function showLock() {
  var input = document.getElementById("password");
  if (input.type === "password") {
    input.style =
      "background-image: url(assets/img/password.svg); background-repeat: no-repeat; background-position: right;   background-position-x: 95%; background-size: 20px;";
  } else {
    input.type = "password";
  }
}


/**
 * Changes the background image of the password input field to an eye image to indicate that the password is visible.
 */
function showEye() {
  var input = document.getElementById("password");
  if (input.type === "password") {
    input.style =
      "background-image: url(assets/img/show.png); background-repeat: no-repeat; background-position: right;   background-position-x: 95%; background-size: 20px;";
  } else {
    input.type = "password";
  }
}


/**
 * Toggles the password input field between text and password types based on whether the "show password" checkbox is checked.
 */
function showPassword() {
  let input = document.getElementById("password");
  let checkbox = document.querySelector(".showPassword");
  if (checkbox.checked) {
    input.type = "text";
  } else {
    input.type = "password";
  }
}


/**
 * Returns a regular expression that checks if an email is valid based on a pattern.
 * @returns {RegExp} - A regular expression object for validating email addresses.
 */
function getEmailRegEx() {
  let emailRegex = /^[.-\wäöüÄÖÜ_]+@[A-Za-z]+\.[A-Za-z]{2,}$/;
  return emailRegex;
}