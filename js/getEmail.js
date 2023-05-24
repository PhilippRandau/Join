/**
 * Handles the form submission event, preventing the default form submission behavior.
 * Validates the user's email, retrieves a response from the server, and attempts to send an email.
 * @async
 * @function onSubmit
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - A promise that resolves once the email has been sent or an error occurs.
 */
async function onSubmit(event) {
  event.preventDefault();
  let user = proofEmail();
  if (user) {
    let response = await getResponse(event);
    tryToSendEmail(response);
  } else {
    window.location.href = "getEmail.html?msg=email is not registered here";
  }
}


/**
 * Validates the user's email by retrieving a user object from the users array that matches the email entered.
 * @returns {Object|null} - The user object, or null if the email is not found.
 */
function proofEmail() {
  let emailInput = document.getElementById("email").value.toLowerCase();
  let email = emailInput.replace(/^\w/, (c) => c.toUpperCase());
  let user = users.find((u) => u.email == email);
  return user;
}


/**
 * Sends a request to the server to send an email, using the data from the submitted form.
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<Response>} - A promise that resolves with the response from the server.
 */
async function getResponse(event) {
  let formData = new FormData(event.target);
  let response = await action(formData);
  return response;
}


/**
 * Displays a message indicating whether the email was successfully sent, and redirects the user to the getEmail.html page.
 * @async
 * @param {Response} response - The response from the server.
 * @returns {Promise<void>} - A promise that resolves once the message has been displayed.
 */
async function tryToSendEmail(response) {
  let popUp = document.getElementById("popUpEmailSend");
  popUp.classList.toggle("d-none", !response.ok);
  setTimeout(() => {
    window.location.href = `getEmail.html?msg=${ response.ok? `email was send to ${email.value}`: "email not send(error: getEmail.js - tryToSendEmail(response)"}`;
  }, 1000);
}


/**
 * Sends a request to the server using the provided form data.
 * @param {FormData} formData - The data from the submitted form.
 * @returns {Promise<Response>} - A promise that resolves with the response from the server.
 */
function action(formData) {
  const input = "https://philipp-randau.developerakademie.net/html/send_mail.php";
  const requestInit = {
    method: "post",
    body: formData,
  };
  return fetch(input, requestInit);
}