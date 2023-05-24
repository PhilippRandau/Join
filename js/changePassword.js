let email = "";

/**
 * Function that loads the users and sets the email variable based on the URL parameter
 * @returns {Promise<void>}
 */
async function onPageLoad() {
  await loadUsers();
  email = getEmailUrlParameter();
}


/**
 * Function that extracts the email parameter from the URL and formats it
 * @returns {string} - the formatted email parameter with the first letter in uppercase
 */
function getEmailUrlParameter() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const currentEmail = urlParams.get("email");
  const emailToLowerCase = currentEmail.toLowerCase();
  const email = emailToLowerCase.replace(/^\w/, (c) => c.toUpperCase());
  return email;
}


/**
 * Function that handles the form submission to change the user password
 * @param {Event} event - the form submission event
 * @returns {Promise<void>}
 */
async function onSubmit(event) {
  event.preventDefault();
  let newPassword = document.getElementById("newPassword").value;
  let confirmNewPassword = document.getElementById("confirmNewPassword");
  let emailFound = users.find((u) => u.email == email);
  if (emailFound && newPassword === confirmNewPassword.value) {
    await changePassword(emailFound, newPassword);
  } else {
    msgBox.innerHTML = "Make sure the second password you typed matches the first";
    confirmNewPassword.classList.add("falseInput");
  }
}


/**
 * Function that changes the password for a given user and saves the changes to the backend
 * @param {Object} emailFound - the user object with the matching email
 * @param {string} newPassword - the new password for the user
 * @returns {Promise<void>}
 */
async function changePassword(emailFound, newPassword) {
  emailFound["password"] = newPassword;
  if (emailFound["password"] === newPassword) {
    let popUp = document.getElementById("popUpPasswordChange");
    popUp.classList.remove("d-none");
    await backend.setItem("users", users);
    setTimeout(() => {
      popUp.classList.add("d-none");
      window.location.href = "/index.html?msg=password was change";
    }, 1500);
  }
}
