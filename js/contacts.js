let currentSelectedID = [];

let idForEditContact = null;

let originalUsers = null;
let prevContact = null;

/**
 * Initializes the contacts by calling the init(), loadContactsData(), and loadUsers() functions.
 * @async
 */
async function initContacts() {
  await init();
  await loadUsers();
  console.log(users)
  loadContactsData();
}


/**
 * Asynchronously loads contacts data, ensuring that contacts are available before rendering.
 */
async function loadContactsData() {
  await proofContactsAvailable();
  renderContacts();
}


/**
 * Checks if there are no contacts and calls getCurrentUserData() to create a new contact if true.
 * @async
 */
async function proofContactsAvailable() {
  let contact;
  if (noContacts() === true) {
    let newContact = getCurrentUserData(contact)
    setCurrentUserData(newContact)
  }
}


/**
 * Returns true if there are no current user contacts, otherwise returns false.
 * @returns {boolean} Whether there are no current user contacts or not.
 */
function noContacts() {
  if (users == null || users.length == 0 || users == undefined) {
    return true
  } else {
    return false
  }
}


/**
 * Returns an object containing the current user's data as a contact.
 * @param {object} contact - An object containing the current user's data.
 * @returns {object} The current user's data as a contact object.
 */
function getCurrentUserData() {
  let nameInitials = getInitialLetters(currentUser["name"]);
  let initialsUpper = nameInitials.toUpperCase();
  newContact = {
    contactCreatorID: currentUser["id"],
    name: currentUser["name"],
    email: currentUser["email"],
    phone: "Edit your Number",
    initialLetters: initialsUpper,
    color: currentUser["color"],
    contactID: 0,
  };
  return newContact
}


/**
 * Adds the new contact to the current user's contacts and saves it to the backend.
 * @async
 * @param {Object} newContact - The new contact to be added to the current user's contacts.
 */
async function setCurrentUserData(newContact) {
  users.push(newContact);
  await backend.setItem(`userID${currentUser["id"]}Contacts`, users);
}


/**
 * Closes the add new contact popup and hides it from view.
 */
function closeAddNewContact() {
  slideOutAnimation('addContact', 'addContactPopup');
  setTimeout(() => {
    let container = document.getElementById("addContactPopup");
    container.classList.add("d-none");
  }, 750);
}


/**
 * Opens the add new contact popup and shows it on the page.
 */
function openAddNewContact() {
  let container = document.getElementById("addContactPopup");
  container.classList.remove("d-none");
  slideInAnimation('addContact', 'addContactPopup');
}


/**
 * Closes the "edit contact" popup by animating it out and then hiding it.
 */
function closeEditContact() {
  slideOutAnimation('editContact', 'editContactPopup');
  setTimeout(() => {
    let container = document.getElementById("editContactPopup");
    container.classList.add("d-none");
  }, 750);
}


/**
 * Creates a new task board with the specified area and loads the contacts data.
 * Then filters out the contacts with contactID of 0 and adds the remaining contacts to the users array.
 * @async
 * @param {string} area - The area of the new task board to be created.
 */
async function createTaskFromContacts(area) {
  addTaskBoard(area);
  loadContactsData();
  categoryDivExists = true;
}


/**
 * Filters out the previous contact from the users array if it exists.
 * If the specified contact has a contactID other than 0, adds it to the users array and sets the previous contact to the current one.
 * @param {Object} contact - The contact to be checked and added to the users array if its contactID is not 0.
 * @returns {boolean} Whether the contact has a contactID other than 0 or not.
 */
function proofContactDataForTask(contact) {
  if (prevContact) {
    users = users.filter((u) => u.contactID != prevContact.contactID);
  }
  if (contact.contactID != 0) {
    users.push(contact);
    categoryDivExists = true;
    prevContact = contact;
    return true;
  } else {
    return false;
  }
}


/**
 * Creates a new contact from the form data and saves it to the backend.
 * If the form data is valid, calls the setNewContact() function to save the new contact.
 * @async
 * @param {Object} event - The form submission event.
 */
async function createNewContact(event) {
  event.preventDefault();
  closeAddNewContact()
  let nameInput = tryGetName();
  let newColor = addUserColor();
  let emailInput = tryGetEmail();
  let nameInitials = getInitialLetters(nameInput);
  let newPassword = 'setPassword';
  let userProof = proofCurrentUser();
  let numberInput = tryGetPhone();

  let currentContactID = users.length;
  let data = { nameInput, emailInput, newPassword, numberInput, newColor, nameInitials, currentContactID }
  let newContact = makeDataToContact(data);
  if (userProof && proofEmail(emailInput) === true && proofName(nameInput) === true && numberInput.length > 5 && numberInput.length < 16) {
    setNewContact(newContact);
    clearNewContactForm();
  }
}


/**
 * Clears the values in the new contact form.
 */
function clearNewContactForm(){
  document.getElementById("name").value = '';
  document.getElementById("email").value = '';
  document.getElementById("phone").value = '';
}


/**
 * Returns a new contact object with the specified data.
 * @param {Object} data - The form data to be used to create the new contact object.
 * @returns {Object} The new contact object with the specified data.
 */
function makeDataToContact(data) {
  let currentID = users.length - 1;
  let newID = currentID + 1;
  newContact = {
    name: data.nameInput,
    email: data.emailInput,
    password: data.newPassword,
    color: data.newColor,
    id: newID,
    contactCreatorID: currentUser["id"],
    initialLetters: data.nameInitials,
    phone: data.numberInput,
    contactID: data.currentContactID,
  };
  return newContact
}


/**
 * Adds the new contact to the current user's contacts and saves it to the backend.
 * Then animates the "add new contact" popup out, shows the "contact created" popup,
 * and redirects the user to the contacts page after 750 milliseconds.
 * @async
 * @param {Object} newContact - The new contact to be added to the current user's contacts.
 */
async function setNewContact(newContact) {
  users.push(newContact);
  renderContacts();
  await backend.setItem(`userID${currentUser["id"]}Contacts`, users);
  slideOutAnimation('addContact', 'addContactPopup');
  let succesPopup = document.getElementById('createContactPopup')
  succesPopup.classList.remove('d-none');
  setTimeout(() => {
    succesPopup.classList.add('d-none');
  }, 1000);
}


/**
 * Renders the contacts by calling the sortContacts() function, creating the HTML for each contact, and appending it to the contacts area.
 */
function renderContacts() {
  sortContacts();
  let dropArea = document.getElementById("contactsArea");
  dropArea.innerHTML = "";
  let currentLetter = "";
  for (let i = 0; i < users.length; i++) {
    const contact = users[i];
    let firstLetter = contact.name[0].toUpperCase();
    if (firstLetter !== currentLetter) {
      dropArea.innerHTML += `<span class="firstletter">${firstLetter}</span>`;
      currentLetter = firstLetter;
    }
    dropArea.innerHTML += renderContactsHTML(contact);
  }
  loadUsers();
}


/**
 * Sorts the user's contacts alphabetically by name, keeping the main contact (contactID 0) always at the first position.
 */
function sortContacts() {
  users.sort((a, b) => {
    if (a.contactID === currentUser['id']) return -1;
    if (b.contactID === currentUser['id']) return 1;
    return a.name.localeCompare(b.name);
  });
}


/**
 * Opens the selected contact and renders its details on the right section of the page.
 * @param {number} id - The id of the selected contact.
 * @param {number} selectedID - The id of the selected contact.
 */
function openContact(id, selectedID) {
  setFocus(id, selectedID);
  setFocusBubbleContact(selectedID)
  let rightSection = document.getElementById("rightSectionCO");
  rightSection.classList.remove("d-none");
  let contactContainer = document.getElementById("slideContainer");
  contactContainer.classList.remove("d-none");
  let contact = users.find((u) => u.contactID == selectedID);
  renderSelectedContact(contact, selectedID);
}


/**
 * Renders the details of the selected contact on the right section of the page.
 * @param {Object} contact - The selected contact object.
 * @param {number} selectedID - The id of the selected contact.
 */
function renderSelectedContact(contact, selectedID) {
  let initialsSlides = document.getElementById("slideContactsBubble");
  let nameSlide = document.getElementById("slideName");
  let emailSlide = document.getElementById("slideEmail");
  let phoneSlide = document.getElementById("slidePhone");
  let editSlide = document.getElementById("slideEditContact");
  phoneSlide.innerHTML = `+<a class="noDeco" title="click to Call" href="tel:${contact.phone}">${contact.phone}</a>`;
  emailSlide.innerHTML = `<a class="noDeco" title="click to send email" class="" href="mailto:${contact.email}">${contact.email}</a>`;
  nameSlide.innerHTML = `<span class="slideNameSize">${contact.name}</span>`;
  initialsSlides.innerHTML = `<div style="background:${contact.color}" class="slideContactsBubble">${contact.initialLetters}</div>`;
  contactsAddTask.innerHTML = `<div class="lightblueColor addTaskBtnCO add-task" onclick="createTaskFromContacts('todo', ${selectedID})"> <img src="../assets/img/plusIconBlue.svg">  add task</div>`
  editSlide.innerHTML = renderContactAddTaskHTML(selectedID);
}


/**
 * Opens the edit contact popup and loads the current contact data in it.
 * @param {number} selectedID - The id of the selected contact.
 */
function openEditContact(selectedID) {
  slideInAnimation('editContact', 'editContactPopup');
  let popupEditContainer = document.getElementById("editContactPopup");
  popupEditContainer.classList.remove("d-none");
  let contact = users.find((u) => u.contactID == selectedID);
  loadCurrentDataContactEdit(contact, selectedID)
}


/**
 * Loads the current data of the selected contact in the edit contact popup.
 * @param {Object} contact - The selected contact object.
 * @param {number} selectedID - The id of the selected contact.
 */
function loadCurrentDataContactEdit(contact, selectedID) {

  let contactBubble = document.getElementById("bubbleInEditSection");
  let emailEdit = document.getElementById("editEmail");
  let phoneEdit = document.getElementById("editPhone");
  let nameEdit = document.getElementById("editName");
  nameEdit.value = `${contact.name}`
  emailEdit.value = `${contact.email}`;
  let formatedNumber = contact.phone.split(" ")[0] + contact.phone.split(" ")[1];
  phoneEdit.value = `${formatedNumber}`;
  contactBubble.innerHTML = `<div style="background:${contact.color}" class="editContactsBubble">${contact.initialLetters}</div>`;
  setTimeout(() => { phoneEdit.type = "number"; }, 100);
  idForEditContact = selectedID;
}


/**
 * Verifies if the current user is a guest user and returns a corresponding value.
 * @returns {boolean} - True if the user is a guest, false otherwise.
 */
function proofCurrentUser() {
  if (currentUser.name == "Guest User") {
    alert("The guest user can't Edit/Create a Contact.");
    return false;
  }
  return true
}


/**
 * Searches for a contact with the specified ID in the users array and returns it.
 * @param {number} id - The ID of the contact to be found.
 * @returns {Object} - The contact object with the specified ID, or undefined if not found.
 */
function findContactById(id) {
  return users.find(contact => contact.contactID === id);
}


/**
 * Saves changes made to a contact's information to the user's contacts.
 * @param {event} event - The form submission event.
 * @returns {Promise<void>} - A promise that resolves when the user's contacts have been updated.
 */
async function saveEdit(event) {
  event.preventDefault();
  // loadContactsData();
  let userProof = proofCurrentUser()
  let contactToEdit = findContactById(idForEditContact);
  contactToEdit["name"] = tryGetName();
  contactToEdit["email"] = tryGetEmail();
  contactToEdit["phone"] = tryGetPhone();
  contactToEdit["initialLetters"] = getInitialLetters(contactToEdit["name"]);
  if (userProof && proofEditName() === true && proofEditEmail() === true && contactToEdit["phone"].length > 5 && contactToEdit["phone"].length < 16) {
    await backend.setItem(`userID${currentUser["id"]}Contacts`, users);
    loadContactsData();
    closeEditContact();
    slideOutAnimation('editContact', 'editContactPopup');
    openContact('contactContainer', idForEditContact)
  }
}


/**
 * Attempts to get the email from the "email" input field and, if empty, uses the email from the "editEmail" input field.
 * @returns {string} - The retrieved email.
 */
function tryGetEmail() {
  let newEmail = document.getElementById("email").value.toLowerCase();
  addContactEmail(newEmail);
  if (newEmail === "") {
    let nameEdit = document.getElementById("editEmail").value.toLowerCase();
    addContactEmail(nameEdit);
    return nameEdit;
  } else {
    return newEmail;
  }
}


/**
 * Adds a new email to a contact's information.
 * @param {string} email - The new email to add.
 * @returns {string|undefined} - The new email added to the contact's information, or undefined if the email is invalid.
 */
function addContactEmail(email) {
  let newEmail = email;
  let emailRegex = getEmailRegEx(newEmail);
  if (!emailRegex.test(newEmail)) {
    return;
  } else {
    return newEmail;
  }
}


/**
 * Attempts to get the phone number from the "phone" input field and, if empty or equal to the edited phone number, uses the phone number from the "editPhone" input field.
 * @returns {string} - The retrieved phone number.
 */
function tryGetPhone() {
  let newPhone = document.getElementById("phone").value;
  let newNumber = setPhoneNumber(newPhone);
  if (newPhone === "" || newNumber == newPhone) {
    let phoneEdit = document.getElementById("editPhone").value;
    let editNumber = setPhoneNumber(phoneEdit);
    if (editNumber === "") {
      let x = document.getElementById("falseEditPhone")
      x.classList.remove("d-none")
    }
    return editNumber;
  }
  if (newPhone.length < 4) {
    return false;
  } else {
    return newNumber;
  }
}


/**
 * Formats the phone number by removing any non-numeric characters and adding a space after the fourth digit.
 * @param {string} numberInput - The phone number input string.
 * @returns {string} The formatted phone number string.
 */
function setPhoneNumber(numberInput) {
  let phoneNumber = numberInput.replace(/\D/g, "");
  phoneNumber = `${phoneNumber}`;
  phoneNumber = phoneNumber.replace(/(\d{4})(\d{1})/, "$1 $2");
  return phoneNumber;
}


/**
 * Attempts to get the name from the "name" input field and, if empty or already in title case, uses the name from the "editName" input field.
 * @returns {string} - The retrieved name.
 */
function tryGetName() {
  let name = document.getElementById("name").value.toLowerCase();
  let newName = addContactName(name);
  if (name === "" || newName === name) {
    let nameEdit = document.getElementById("editName").value.toLowerCase();
    let editName = addContactName(nameEdit);
    return editName;
  } else {
    return newName;
  }
}


/**
 * Formats the name string by capitalizing the first letter of each word.
 * @param {string} name - The name string.
 * @returns {string} The formatted name string in title case.
 */
function addContactName(name) {
  let newName = name.replace(/\b\w/g, (l) => l.toUpperCase());
  return newName;
}


/**
 * Validates the "editName" input field value to ensure it contains only alphabets and spaces, and each word starts with a capital letter.
 * @returns {boolean} Whether the "editName" input field value is valid or not.
 */
function proofEditName() {
  let regName = /^[\wäöüÄÖÜ]+(?: [\wäöüÄÖÜ]+)+$/;
  let name = document.getElementById("editName").value;
  if (!regName.test(name)) {
    document.getElementById("editName").focus();
    document.getElementById("editName").classList.add("falseInput");
    document.getElementById("falseEditName").classList.remove("d-none")
    return false;
  } else {
    document.getElementById("editName").classList.remove("falseInput");
    document.getElementById("falseEditName").classList.add("d-none")
    return true;
  }
}


/**
 * Validates the "editEmail" input field value to ensure it is a valid email address.
 * @returns {boolean} Whether the "editEmail" input field value is a valid email address or not.
 */
function proofEditEmail() {
  let regEmail = getEmailRegEx();
  let email = document.getElementById("editEmail").value;
  if (!regEmail.test(email)) {
    document.getElementById("editEmail").focus();
    document.getElementById("editEmail").classList.add("falseInput");
    document.getElementById("falseEditEmail").classList.remove("d-none")
    return false;
  } else {
    document.getElementById("falseEditEmail").classList.add("d-none")
    document.getElementById("editEmail").classList.remove("falseInput");
    return true;
  }
}


/**
 * Validates the input value of a phone number input field.
 * @param {string} id - The ID of the phone number input field.
 * @returns {boolean} Whether the input value is valid (i.e., contains between 5 and 15 numbers).
 */
function proofPhone(id) {
  const phoneInput = document.getElementById(id);
  const phoneError = document.getElementById("phoneError");
  if (phoneInput.value.length < 5) {
    setMinTextForInput(id, phoneError)
    return false;
  } else if (phoneInput.value.length > 14) {
    setMaxTextForInput(id, phoneError)
    return false;
  } else {
    setNoneTextForInput(id, phoneError)
    return true;
  }
}


/**
 * Sets an error message and highlights the input field if the phone number input is too short
 * @param {string} id - The ID of the phone number input field
 * @param {HTMLElement} phoneError - The HTML element where the error message should be displayed
 */
function setMinTextForInput(id, phoneError) {
  document.getElementById(id).focus();
  document.getElementById(id).classList.add("falseInput");
  phoneError.innerText = "Phone number min 5 Numbers";
}


/**
 * Sets an error message and highlights the input field if the phone number input is too long
 * @param {string} id - The ID of the phone number input field
 * @param {HTMLElement} phoneError - The HTML element where the error message should be displayed
 */
function setMaxTextForInput(id, phoneError) {
  document.getElementById(id).focus();
  document.getElementById(id).classList.add("falseInput");
  phoneError.innerText = "Phone number max 15 Numbers";
}


/**
 * Removes the error text and styling from an input field.
 * @param {string} id - The ID of the input field.
 * @param {HTMLElement} phoneError - The error message element.
 */
function setNoneTextForInput(id, phoneError) {
  phoneError.innerText = "";
  document.getElementById(id).classList.remove("falseInput");
}


/**
 * Clears the input fields for name, email, and phone number, and closes the add contact modal
 */
function clearContactsInputs() {
  let name = document.getElementById("name");
  name.value = "";
  let email = document.getElementById("email");
  email.value = "";
  let phone = document.getElementById("phone");
  phone.value = "";
  closeAddNewContact()
}


// Responsive //
/**
 * Hides the right section of the page when the media query matches a max-width of 1000px
 */
function backToContacts() {
  let rightContactContainer = document.getElementById('rightSectionCO')
  rightContactContainer.classList.add('d-none')
}


/**
 * Toggles the visibility of certain elements on the page depending on whether the media query matches
 * @param {MediaQueryListEvent} x - The media query list event that fired
 */
function myFunction(x) {
  let textPosi = document.getElementById('textPosi')
  let textPosiRE = document.getElementById('textPosiRE')
  let sectionHidden = document.getElementById('rightSectionCO')
  if (x.matches) { // If media query matches
    textPosi.classList.add('d-none')
    textPosiRE.classList.remove('d-none')
    sectionHidden.classList.add('d-none')
  } else {
    textPosi.classList.remove('d-none')
    textPosiRE.classList.add('d-none')
    sectionHidden.classList.remove('d-none')
  }
}


/**
 * Sets a function to be executed after a specified amount of time has elapsed.
 * @param {Function} fn - The function to be executed.
 * @param {number} delay - The time to wait before executing the function, in milliseconds.
 * @returns {number} - The numeric ID of the timeout, which can be used with `clearTimeout()`.
 */
setTimeout(() => {
  let x = window.matchMedia("(max-width: 1000px)")
  myFunction(x) // Call listener function at run time
  x.addListener(myFunction) // Attach listener function on state changes
}, 100);