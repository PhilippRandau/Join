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
    let mediumPrioText = document.getElementById("mediumPrioText");
    let urgentPrioText = document.getElementById("urgentPrioText");
    lowPrioText.style = "color: black;";
    mediumPrioText.style = "color: black;";
    urgentPrioText.style = "color: black;";
  }
  
  
  /**
   * Resets the color of the priority buttons.
   */
  function clearPrioBtnWhite() {
    let urgentBtnContainer = document.getElementById("urgentBtnContainer");
    let mediumBtnContainer = document.getElementById("mediumBtnContainer");
    let lowContainer = document.getElementById("lowBtnContainer");
    lowContainer.classList.remove("prioLowContainerOnClick");
    urgentBtnContainer.classList.remove("priourgentContainerOnClick");
    mediumBtnContainer.classList.remove("priomediumContainerOnClick");
  }
  
  
  /**
   * Resets the color of the priority symbols.
   */
  function clearPrioSVG() {
    let svglowColor = document.getElementById("svglow");
    let svgmediumColor = document.getElementById("svgmedium");
    let svgurgentColor = document.getElementById("svgurgent");
    svglowColor.classList.remove("prioIconWhite");
    svgmediumColor.classList.remove("prioIconWhite");
    svgurgentColor.classList.remove("prioIconWhite");
  }
  
  
  /**
   * Opens the form to add a task.
   */
  function openAddTask() {
    document.getElementById("addTask").innerHTML = addTaskHTML();
  }
  
  //Prio section//
  /**
   * Checks which priority button is checked (urgent, medium, low) and returns the corresponding priority string.
   * @param {string} edit - The edit ID of the priority button.
   * @returns {string} The priority string (urgent, medium, low).
   */
  function checkPrio(edit) {
    let urgentBtn = document.getElementById(`urgentBtn${edit}`);
    let mediumBtn = document.getElementById(`mediumBtn${edit}`);
    let lowBtn = document.getElementById(`lowBtn${edit}`);
    if (urgentBtn.checked === true) {
      return "urgent";
    }
    if (mediumBtn.checked === true) {
      return "medium";
    }
    if (lowBtn.checked === true) {
      return "low";
    }
  }
  
  
  /**
   * Sets the priority checkbox and related styles based on the selected priority.
   * @param {string} prio - The selected priority ("low", "medium", or "urgent").
   * @param {string} taskEdit - The identifier of the task edit.
   */
  function setPrioCheckBox(prio, taskEdit) {
    if (prio === "low") {
      resetAllPrioBtn('medium', 'urgent', taskEdit);
      setPrioBtn(taskEdit,'low');
    }
    if (prio === "medium") {
      resetAllPrioBtn('low', 'urgent', taskEdit);
      setPrioBtn(taskEdit,'medium');
    }
    if (prio === "urgent") {
      resetAllPrioBtn('low', 'medium', taskEdit);
      setPrioBtn(taskEdit,'urgent');
    }
  }
  
  
  /**
   * Resets all priority buttons and checkboxes except for the specified buttons (uncheckBtn1 and uncheckBtn2) and taskEdit ID.
   * @param {string} uncheckBtn1 - The ID of the first button to uncheck.
   * @param {string} uncheckBtn2 - The ID of the second button to uncheck.
   * @param {string} taskEdit - The edit ID of the task.
   */
  function resetAllPrioBtn(uncheckBtn1, uncheckBtn2, taskEdit) {
    document.getElementById(`${uncheckBtn1}Btn${taskEdit}`).checked = false;
    document.getElementById(`${uncheckBtn2}Btn${taskEdit}`).checked = false;
    document.getElementById(`svglow${taskEdit}`).classList.remove("prioIconWhite");
    document.getElementById(`svgmedium${taskEdit}`).classList.remove("prioIconWhite");
    document.getElementById(`svgurgent${taskEdit}`).classList.remove("prioIconWhite");
    document.getElementById(`lowPrioText${taskEdit}`).style = "color: black;";
    document.getElementById(`mediumPrioText${taskEdit}`).style = "color: black;";
    document.getElementById(`urgentPrioText${taskEdit}`).style = "color: black;";
    document.getElementById(`lowBtnContainer${taskEdit}`).classList.remove("priolowContainerOnClick");
    document.getElementById(`mediumBtnContainer${taskEdit}`).classList.remove("priomediumContainerOnClick");
    document.getElementById(`urgentBtnContainer${taskEdit}`).classList.remove("priourgentContainerOnClick");
  }
  
  
  /**
   * Sets the priority button and related styles for the specified task edit and priority.
   * @param {string} taskEdit - The identifier of the task edit.
   * @param {string} prio - The priority ("low", "medium", or "urgent").
   */
  function setPrioBtn(taskEdit, prio){
    let prioBtn = document.getElementById(`${prio}Btn${taskEdit}`);
    prioBtn.checked = true;
    setPrioBtnColor(taskEdit, prio);
    setPrioSvgColor(taskEdit, prio);
    setPrioTextColor(taskEdit, prio);
  }
  
  
  /**
   * Sets the priority button color for the specified task edit and priority.
   * @param {string} taskEdit - The identifier of the task edit.
   * @param {string} prio - The priority ("low", "medium", or "urgent").
   */
  function setPrioBtnColor(taskEdit, prio) {
    let prioContainer = document.getElementById(`${prio}BtnContainer${taskEdit}`);
    prioContainer.classList.add(`prio${prio}ContainerOnClick`);
  }
  
  
  /**
   * Sets the priority SVG color for the specified task edit and priority.
   * @param {string} taskEdit - The identifier of the task edit.
   * @param {string} prio - The priority ("low", "medium", or "urgent").
   */
  function setPrioSvgColor(taskEdit, prio) {
    let svgColor = document.getElementById(`svg${prio}${taskEdit}`);
    svgColor.classList.add("prioIconWhite");
  }
  
  
  /**
   * Sets the priority text color for the specified task edit and priority.
   * @param {string} taskEdit - The identifier of the task edit.
   * @param {string} prio - The priority ("low", "medium", or "urgent").
   */
  function setPrioTextColor(taskEdit, prio) {
    let prioText = document.getElementById(`${prio}PrioText${taskEdit}`);
    prioText.style = "color: white;";
  }

  //Subtask section//

/**
 * Sets the subtask input field's background image and visibility of the input buttons container based on whether the input field is empty or not
 */
function setNewSubtask() {
  let subtask = document.getElementById("subtask");
  let subtaskBtns = document.getElementById("subtaskInputBtnsContainer");
  if (subtask.value === "") {
    subtask.style = "background-image: url(../assets/img/plusSubtask.svg);";
    subtaskBtns.classList.add("d-none");
  } else {
    subtaskInputBtnsContainer;
    subtask.style = "background-image: url();";
    subtaskBtns.classList.remove("d-none");
  }
}


/**
 * Clears the subtask input field and sets the subtask input field's background image and visibility of the input buttons container
 */
function closeNewSubtask() {
  let subtaskInput = document.getElementById("subtask");
  subtaskInput.value = "";
  setNewSubtask();
}


/**
 * Adds a new subtask to the newCreateSubtask array and calls the renderNewSubtask function
 */
function acceptNewSubtask() {
  let subtaskInput = document.getElementById("subtask");
  let subtask = subtaskInput.value;
  if (subtask) {
    newCreateSubtask.push(subtask);
  }
  renderNewSubtask();
}


/**
 * Renders the newCreateSubtask array's subtasks dynamically to the HTML page
 */
function renderNewSubtask() {
  let subtaskCheckboxArea = document.getElementById("subtaskCheckboxArea");
  subtaskCheckboxArea.innerHTML = "";
  for (let i = 0; i < newCreateSubtask.length; i++) {
    const subtask = newCreateSubtask[i];
    subtaskCheckboxArea.innerHTML += renderNewSubtaskHTML(subtask, i);
  }
  closeNewSubtask();
}


/**
 * Adds or removes the selected subtask from the newSubtask array when its checkbox is clicked
 * @param {Event} event - The event object
 * @param {string} subtask - The subtask string
 */
function checkSubtask(event, subtask) {
  let checkbox = event.target;
  if (checkbox.checked) {
    newSubtask.push(subtask);
  }
}


/**
 * Programmatically checks or unchecks the subtask's checkbox based on the text's click event
 * @param {number} i - The subtask index number
 */
function checkSubtastText(i) {
  let checkbox = document.getElementById(`subtask${i}`);
  checkbox.click();
}


/** 
* Sets an event listener to the "addTask" element and closes the "assignedTo" and "category" popups if they are open.
* @global
* @listens DOMContentLoaded
*/
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById("addTask")) {
    let addTaskDiv = document.getElementById("addTask");
    addTaskDiv.addEventListener('click', function (event) {
      if (slideCategory === true || slideAssignTo === true) {
        closeContactsAndAssignedToPopup(event)
      }
    });
  };
});


/**
 * Closes the category and assigned to popups when the user clicks outside of their respective containers
 * @param {Event} event - The event object
 */
function closeContactsAndAssignedToPopup(event) {
  let assignedToDiv = document.getElementById('inputContainer');
  let categoryDiv = document.getElementById('openCategoryContainer');
  let createContactPopup = document.getElementById('createContactPopup');
  if (categoryDiv.contains(event.target) || assignedToDiv.contains(event.target)) {
    return;
  }
  if (createContactPopup) {
    createContactPopup.classList.contains('d-none')
  }
  if (slideCategory === true && selectedCategory.innerHTML === "select a category") {
    openCategory();
  }
  if (slideAssignTo === true && selectedContacts) {
    openAssignedTo('arrayAssigned', 'contactDiv', 'contactList', 'contacts', 'contactInitials', 'inputContainer')
  }
}


/**
 * Closes the assigned to popup when the user clicks outside of its container
 * @param {Event} event - The event object
 */
function closeEditAssignedToPopup(event) {
  let assignedToDiv = document.getElementById('contactDivEdit');
  if (assignedToDiv.contains(event.target)) {
    return;
  }
  if (slideAssignTo === true && selectedContacts) {
    openAssignedTo('arrayAssignedEdit', 'contactDivEdit', 'contactListEdit', 'contactsEdit', 'contactInitialsEdit', 'input-container')
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