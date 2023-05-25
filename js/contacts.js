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
  document.getElementById('deleteCurrentContact').style.backgroundColor = 'white';
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
function clearNewContactForm() {
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

async function deleteContact(event) {
  event.preventDefault();
  let userProof = proofCurrentUser();
  if (userProof && deleteContactById(idForEditContact)) {
    await backend.setItem(`userID${currentUser["id"]}Contacts`, users);
    loadContactsData();
    closeEditContact();
    slideOutAnimation('editContact', 'editContactPopup');
    document.getElementById('slideContainer').classList.add('d-none');
  }
}

function deleteContactById(id){
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id && id !== 0) {
      users.splice(i, 1);
      return true;
    }
  }
  // alert("The guest user cannot be deleted.");
  document.getElementById('deleteCurrentContact').style.backgroundColor = 'red';
  return false;
}