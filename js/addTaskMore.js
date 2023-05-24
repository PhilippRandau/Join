//category section//
/**
 * Loads the category data from the server
 * @returns {Promise<void>} Promise object that resolves when the data has been loaded
 */
async function loadCategory() {
  await downloadFromServer();
  let item = await backend.getItem("categorys");
  if (typeof item === "string") {
    categorys = JSON.parse(item) || [];
  } else {
    categorys = item;
  }
}


/**
 * Opens the category dropdown menu
 */
async function openCategory() {
  let openCategory = document.getElementById("categoryIsOpen");
  openCategory.classList.remove("openCategory");
  openCategory.classList.add("categoryIsOpen");
  let selectedCategory = document.getElementById("selectedCategory");
  selectedCategory.classList.add("selectedCategoryTextOpen");
  selectedCategory.innerHTML = "select a category";
  toggleOpenFunction();
  getCategorys();
}


/**
 * Toggles the category dropdown menu
 */
function toggleOpenFunction() {
  if (slideCategory === false) {
    slideOutCategory();
  } else {
    slideInCategory();
    document.getElementById('category-anim').classList.add("d-none");

  }
}


/**
 * Animates the category dropdown menu sliding in
 */
function slideInCategory() {
  arrayCategory.classList.remove("rotateIcon");
  document.getElementById('category-anim').classList.add("slide-in-top");
  document.getElementById('category-anim').classList.remove("slide-out-top");
  document.getElementById('categoryIsOpen').classList.remove('noneBottomBorder');
  slideCategory = false;
}


/**
 * Animates the category dropdown menu sliding out
 */
function slideOutCategory() {
  document.getElementById('category-anim').classList.remove("d-none");
  arrayCategory.classList.add("rotateIcon");
  document.getElementById('category-anim').classList.remove("slide-in-top");
  document.getElementById('category-anim').classList.add("slide-out-top");
  document.getElementById('categoryIsOpen').classList.add('noneBottomBorder');
  slideCategory = true;
}


/**
 * Shows the "Create new category" interface
 */
function newCategory() {
  let openCategory = document.getElementById("openCategoryContainer");
  openCategory.classList.add("d-none");
  let createCategory = document.getElementById("createCategory");
  createCategory.classList.remove("d-none");
  let createCategoryContainer = document.getElementById("createCategoryContainer");
  createCategoryContainer.classList.remove("d-none");
}


/**
 * Closes the "Create new category" interface
 */
function closeNewCategory() {
  let openCategorys = document.getElementById("openCategoryContainer");
  openCategorys.classList.remove("d-none");
  let createCategory = document.getElementById("createCategoryContainer");
  createCategory.classList.add("d-none");

}


/**
 * Sets the new category and closes the "Create new category" interface
 * @returns {Promise<void>} Promise object that resolves when the new category has been set
 */
async function setNewCategory() {
  let arrayCategory = document.getElementById("arrayCategory");
  arrayCategory.classList.remove("rotateIcon");
  let categoryContainer = document.getElementById("createCategoryContainer");
  categoryContainer.classList.add("d-none");
  let openCategorys = document.getElementById("openCategoryContainer");
  openCategorys.classList.remove("d-none");
  document.getElementById('category-anim').classList.add("d-none");
  document.getElementById('categoryIsOpen').classList.remove('noneBottomBorder');
  renderNewCategory();
}


/**
 * Renders the selected category in the UI
 */
function renderNewCategory() {
  let selectedCategory = document.getElementById("selectedCategory");
  selectedCategory.innerHTML = renderNewCategoryHTML();
}


/**
 * Retrieves and displays all categories in the UI
 * @returns {Promise<void>} Promise object that resolves when all categories have been rendered
 */
async function getCategorys() {
  await proofAndSetTasks();
  let allCategorys = document.getElementById(`allCategorys`);
  allCategorys.innerHTML = "";
  for (let i = 0; i < allTasks.length; i++) {
    let taskCategory = allTasks[i].category;
    let taskColor = allTasks[i].titleBg;
    indexOfCategory(taskCategory, taskColor);
  }
  renderCategorys();
}


/**
 * Renders all categories in the UI
 */
function renderCategorys() {
  for (let c = 0; c < displayedCategories.length; c++) {
    const element = displayedCategories[c];
    let category = element;
    let color = displayedCategoriesColor[c];
    allCategorys.innerHTML += renderCategorysHTML(c, category, color);
  }
}


/**
 * Determines the index of the task's category and color
 * @param {string} taskCategory - The category of the task
 * @param {string} taskColor - The color of the task's title background
 */
function indexOfCategory(taskCategory, taskColor) {
  if (displayedCategories.indexOf(taskCategory) === -1) {
    displayedCategories.push(taskCategory);
    displayedCategoriesColor.push(taskColor);
  }
}


/**
 * Sets the chosen category in the UI
 * @param {string} category - The category that has been selected
 * @param {string} color - The color of the selected category's title background
 */
function chooseCategory(category, color) {
  let arrayCategory = document.getElementById("arrayCategory");
  document.getElementById('categoryIsOpen').classList.remove('noneBottomBorder');
  arrayCategory.classList.remove("rotateIcon");
  let selectedCategory = document.getElementById("selectedCategory");
  selectedCategory.innerHTML = chooseCategoryHTML(category, color);
  setOldCategory(category, color);
  renderOldCategory(category, color);
}


/**
 * Updates the UI to reflect the selected category
 * @param {string} category - The category that has been selected
 * @param {string} color - The color of the selected category's title background
 */
function setOldCategory() {
  let createCategory = document.getElementById("createCategory");
  createCategory.classList.add("d-none");
  let categoryContainer = document.getElementById("createCategoryContainer");
  categoryContainer.classList.add("d-none");
  let openCategorys = document.getElementById("openCategoryContainer");
  openCategorys.classList.remove("d-none");
  document.getElementById('category-anim').classList.add("d-none");
}


/**
 * Sets the selected category in the UI to the current category
 */
function renderOldCategory(category, color) {
  currentCategoryColor.push(color);
  let selectedCategory = document.getElementById("selectedCategory");
  selectedCategory.innerHTML = renderOldCategoryHTML(category, color);
}


/**
 * Sets the color of the selected category in the UI
 * @param {string} color - The color to set
 */
function setColor(color) {
  clearColors(color);
  let selectColor = document.getElementById("category" + color);
  selectColor.style.border = "2px solid " + color;
  let dropColorContainer = document.getElementById("dropColorContainer");
  dropColorContainer.innerHTML = `<div style="border: 2px solid ${color};cursor:auto" class="colorCategory${color}"></div>`;
  currentCategoryColor.push(color);
}


/**
 * Clears the color selection UI
 * @param {string} color - The color to clear
 */
function clearColors(color) {
  let colorSelection = document.querySelectorAll(".colorCategoryContainer div");
  for (let i = 0; i < colorSelection.length; i++) {
    colorSelection[i].style.border = "";
  }
  currentCategoryColor.splice(color);
}


/**
 * Shows the selected color in the "Create new category" interface
 */
function dropColorInInput() {
  let categoryInput = document.getElementById("createCategory");
  let dropColorContainer = document.getElementById("dropColorContainer");
  if (categoryInput.value == "") {
    dropColorContainer.classList.add("d-none");
  } else {
    dropColorContainer.classList.remove("d-none");
  }
}


//Assigned to section//
/**
 * Opens or closes the assigned-to dropdown and toggles the assigned-to icon.
 * @param {string} assignedToIconID - The ID of the assigned-to icon.
 * @param {string} hideBoarderID - The ID of the HTML element that contains the contacts.
 * @param {string} expandContactsID - The ID of the HTML element that expands the contacts list.
 * @param {string} showContactsID - The ID of the HTML element that shows the contacts.
 * @param {string} contactInitialsID - The ID of the HTML element that contains the selected contacts' initials.
 * @param {string} assignedToID - The ID of the HTML element that contains the assigned-to dropdown.
 */
function openAssignedTo(assignedToIconID, hideBoarderID, expandContactsID, showContactsID, contactInitialsID, assignedToID) {
  let arrayAssigned = document.getElementById(assignedToIconID);
  let inputContainer = document.getElementById(assignedToID);
  arrayAssigned.classList.toggle("rotateIcon");
  if (slideAssignTo === false) {
    inputContainer.classList.add('responsiveAssigned');
    slideOutAssignedTo(hideBoarderID, expandContactsID, assignedToID);
    renderOpenAssignedTo(showContactsID, contactInitialsID);
    slideAssignTo = true;
  } else {
    inputContainer.classList.remove('responsiveAssigned');
    slideInAssignedTo(hideBoarderID, expandContactsID, assignedToID);
  }
}


/**
 * Slides in the assigned-to dropdown.
 * @param {string} hideBoarderID - The ID of the HTML element that contains the contacts.
 * @param {string} expandContactsID - The ID of the HTML element that expands the contacts list.
 * @param {string} assignedToID - The ID of the HTML element that contains the assigned-to dropdown.
 */
function slideInAssignedTo(hideBoarderID, expandContactsID, assignedToID) {
  let contactDiv = document.getElementById(hideBoarderID);
  contactDiv.classList.toggle("noneBottomBorder");
  let contactList = document.getElementById(expandContactsID);
  contactList.classList.add("slide-in-top");
  contactList.classList.remove("slide-out-top");
  contactList.classList.toggle("d-none");
  slideAssignTo = false;
  assignedToBlockShiftIn(assignedToID);
}


/**
 * Shifts the assigned-to block in.
 * @param {string} inputID - The ID of the HTML element that contains the assigned-to dropdown.
 */
function assignedToBlockShiftIn(inputID) {
  document.getElementById(inputID).style.marginBottom = '10px';
}


/**
 * Slides out the assigned-to dropdown.
 * @param {string} hideBoarderID - The ID of the HTML element that contains the contacts.
 * @param {string} expandContactsID - The ID of the HTML element that expands the contacts list.
 * @param {string} assignedToID - The ID of the HTML element that contains the assigned-to dropdown.
 */
function slideOutAssignedTo(hideBoarderID, expandContactsID, assignedToID) {
  let contactDiv = document.getElementById(hideBoarderID);
  contactDiv.classList.toggle("noneBottomBorder");
  let contactList = document.getElementById(expandContactsID);
  contactList.classList.remove("slide-in-top");
  contactList.classList.add("slide-out-top");
  contactList.classList.toggle("d-none");
  assignedToBlockShiftOut(assignedToID);
}


/**
 * This function is used to calculate the spacing of an HTML element based on the number of users in a list.
 * @param {*} inputID - Die ID des HTML-Elements, für das der Abstand berechnet werden soll.
 */
function assignedToBlockShiftOut(inputID) {
  if (users.length === 1) {
    document.getElementById(inputID).style.marginBottom = '-25px';
  } else if (users.length === 2) {
    document.getElementById(inputID).style.marginBottom = '-59px';
  } else if (users.length === 3) {
    document.getElementById(inputID).style.marginBottom = '-93px';
  } else if (users.length === 4) {
    document.getElementById(inputID).style.marginBottom = '-127px';
  } else if (users.length >= 5) {
    document.getElementById(inputID).style.marginBottom = '-131px';
  }
}


/**
 * Renders the open assigned contacts section.
 * @async
 * @param {string} showContactsID - The ID of the HTML element that shows the contacts.
 * @param {string} contactInitialsID - The ID of the contact initials element.
 */
async function renderOpenAssignedTo(showContactsID, contactInitialsID) {
  await downloadFromServer();
  readWriteSelectedContacts(contactInitialsID);
  let contacts = document.getElementById(showContactsID);
  contacts.innerHTML = "";
  let idHash = {};
  for (let i = 0; i < users.length; i++) {
    checked = false;
    let assignedData = getAssignedContacts(i);
    filterRenderBubble(assignedData);
    if (!idHash[users[i]['id']] || !idHash[users[i]['contactID']]) {
      contacts.innerHTML += renderOpenAssignedToHTML(assignedData, checked, i, contactInitialsID);
      idHash[users[i]['id']] = true;
    }
  }
}


/**
 * Reads or writes the selected contacts for a task based on the given ID of the contact initials element.
 * @param {string} contactInitialsID - The ID of the contact initials element, which determines whether to read or write the selected contacts.
 */
function readWriteSelectedContacts(contactInitialsID) {
  if (contactInitialsID === 'contactInitialsEdit' && selectedContacts.length == 0) {
    selectedContacts = allTasks[currentTaskID].assignedTo;
  } else if (contactInitialsID === 'contactInitialsEdit') {
    allTasks[currentTaskID].assignedTo = selectedContacts;
  }
}


/**
 * Filters and renders a bubble for each assigned contact.
 * @param {Object} assignedData - The assigned contact data.
 */
function filterRenderBubble(assignedData) {
  for (let j = 0; j < selectedContacts.length; j++) {
    if (selectedContacts[j].name === assignedData.contactName) {
      checked = true;
      break;
    } else {
      checked = false;
    }
  }

}


/**
 * Returns an object containing the contact name, color, and initials based on the given index.
 * @param {number} i - The index of the contact in the users array.
 * @returns {Object} - An object containing the contact name, color, and initials.
 */
function getAssignedContacts(i) {
  let contactName = users[i].name;
  let contactColor = users[i].color;
  let contactInitials = users[i].initialLetters;
  return { contactName, contactColor, contactInitials };
}


/**
 * Selects a contact based on the given parameters, and updates the selected contacts array and the rendered contact bubbles.
 * @param {string} contactName - The name of the selected contact.
 * @param {string} contactColor - The color of the selected contact.
 * @param {string} contactInitials - The initials of the selected contact.
 * @param {number} i - The index of the selected contact in the users array.
 * @param {string} contactInitialsID - The ID of the element that renders the selected contact bubbles.
 */
function selectContact(contactName, contactColor, contactInitials, i, contactInitialsID) {
  let checkbox = document.getElementById(`contactCheckbox${i}`);
  if (checkbox.checked) {
    let contact = {
      name: contactName,
      color: contactColor,
      initial: contactInitials,
    };
    selectedContacts.push(contact);
  } else {
    selectedContacts = selectedContacts.filter((contact) => contact.name !== contactName);
  }
  renderSelectContact(contactInitialsID);
}


/**
 * Toggles the checkbox of a contact based on the given index.
 * @param {number} i - The index of the contact in the users array.
 */
function selectContactName(i) {
  let checkbox = document.getElementById(`contactCheckbox${i}`);
  checkbox.click();
}


/**
 * Renders the selected contact bubbles based on the selectedContacts array and the given ID of the element.
 * @param {string} contactInitialsID - The ID of the element that renders the selected contact bubbles.
 */
function renderSelectContact(contactInitialsID) {
  let contactInitials = document.getElementById(contactInitialsID);
  contactInitials.innerHTML = ``;
  for (let i = 0; i < selectedContacts.length; i++) {
    let color = selectedContacts[i].color;
    let initialLetters = selectedContacts[i].initial;
    contactInitials.innerHTML += renderSelectContactHTML(color, initialLetters);
  }
}



/**
 * Clears the current task and resets all input fields.
 */
function clearTask() {
  clearPrio();
  newCategory();
  closeNewCategory();
  closeNewSubtask();
  acceptNewSubtask();
  clearDataAndInputs();
  let bubbles = document.getElementById('contactInitials')
  bubbles.innerHTML = ""
  if (slideCategory == true) {
    openCategory();
  }
  if (slideAssignTo == true) {
    contactDiv.click();
  }
}


/**
 * Resets all input fields and current array.
 */
function clearDataAndInputs() {
  let titleInput = document.getElementById("title");
  let descriptionInput = document.getElementById("description");
  let categoryInput = document.getElementById("createCategory");
  let dateInput = document.getElementById("date");
  newSubtask = [];
  newCreateSubtask = [];
  selectedContacts = [];
  titleInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
}


/**
 * Resets the priority by resetting the corresponding buttons and texts.
 */
function clearPrio() {
  let urgentBtn = document.getElementById("urgentBtn");
  let mediumBtn = document.getElementById("mediumBtn");
  let lowBtn = document.getElementById("lowBtn");
  urgentBtn.checked = false;
  mediumBtn.checked = false;
  lowBtn.checked = false;
  clearPrioText();
  clearPrioBtnWhite();
  clearPrioSVG();
}


/**
 * Resets the priority texts.
 */
function clearPrioText() {
  let lowPrioText = document.getElementById("lowPrioText");
  let normalPrioText = document.getElementById("normalPrioText");
  let highPrioText = document.getElementById("highPrioText");
  lowPrioText.style = "color: black;";
  normalPrioText.style = "color: black;";
  highPrioText.style = "color: black;";
}


/**
 * Resets the color of the priority buttons.
 */
function clearPrioBtnWhite() {
  let highBtnContainer = document.getElementById("highBtnContainer");
  let normalBtnContainer = document.getElementById("normalBtnContainer");
  let lowContainer = document.getElementById("lowBtnContainer");
  lowContainer.classList.remove("prioLowContainerOnClick");
  highBtnContainer.classList.remove("prioHighContainerOnClick");
  normalBtnContainer.classList.remove("prioNormalContainerOnClick");
}


/**
 * Resets the color of the priority symbols.
 */
function clearPrioSVG() {
  let svgLowColor = document.getElementById("svgLow");
  let svgNormalColor = document.getElementById("svgNormal");
  let svgHighColor = document.getElementById("svgHigh");
  svgLowColor.classList.remove("prioIconWhite");
  svgNormalColor.classList.remove("prioIconWhite");
  svgHighColor.classList.remove("prioIconWhite");
}


/**
 * Opens the form to add a task.
 */
function openAddTask() {
  document.getElementById("addTask").innerHTML = addTaskHTML();
}