

/**
 * Validates the user's inputted email by checking if it is in a valid format (using a regex) and if it matches any email in the users array.
 * If both conditions are met, the function returns the inputted email, otherwise it returns undefined.
 * @returns {string|undefined} The inputted email if it is valid and matches any email in the users array, otherwise undefined.
 */
function setLoginEmail() {
    let email = document.getElementById("email").value.toLowerCase();
    // let newEmail = email.replace(/^\w/, (c) => c.toUpperCase());
    let emailFound = users.find((u) => u.email.toLowerCase() == email);
    let emailRegex = getEmailRegEx();
    if (emailFound && emailRegex.test(email)) {
      return email;
    } else {
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
    email.value = 'Xxx@xxx.xx';
    let password = document.getElementById("password");
    password.value = 'v67rR§F$';
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