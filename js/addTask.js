let slideAssignTo = false;
let slideCategory = false;

let currentCategoryColor = [];
let displayedCategories = [];
let displayedCategoriesColor = [];

let newCreateSubtask = [];
let newSubtask = [];

let selectedContacts = [];
let allContacts = [];


/**
 * Initializes the application by calling necessary functions.
 * @async
 * @returns {Promise<void>}
 */
async function initTask() {
  await init();
  await openAddTask();
  await loadUsers();
  await loadCategory();
}


/**
 * Loads tasks from the server. If "allTasks" can be retrieved from the backend, it is saved in allTasks. 
 * If "allTasks" is a string, the result is parsed with JSON.parse(). 
 * If "allTasks" cannot be retrieved from the backend, allTasks is set to an empty array. Finally, proofAndSetTasks() is called.
 * @async
 * @returns {Promise<void>}
 */
async function loadTasks() {
  await downloadFromServer();
  let item = await backend.getItem("allTasks");
  if (typeof item === "string") {
    allTasks = JSON.parse(item) || [];
  } else {
    allTasks = item;
  }
  await proofAndSetTasks()
}


/**
 * Ensures allTasks is not empty. If it is, allTasks is set to an array with one object (with some predefined properties). This object is then sent to the backend to update "allTasks".
 * @async
 * @returns {Promise<void>}
 */
async function proofAndSetTasks() {
  if (!allTasks) {
    allTasks = [{ id: 0, category: "Design", titleBg: "Red" }];
    await backend.setItem("allTasks", allTasks);
  }
}


/**
 * Creates a new task by validating and extracting task data from the UI and adding it to allTasks array using setTaskData(newTask).
 * @async
 * @param {Event} event - The event object.
 * @returns {Promise<void>}
 */
async function createNewTask(event) {
  proofEvent(event);
  await loadTasks();
  let newTask = await getTaskData();
  let proof = taskProofSection(newTask);
  if (proof === true) {
    await setTaskData(newTask);
    checkForLoadBoard();
  }
}


/**
  * Checks if the current URL contains the word "board" and performs actions accordingly.
  * If the URL contains "board", it renders the board, closes the "Add Task" board, and clears the task input.
  * If the URL does not contain "board", it redirects the user to the "board.html" page after a delay of 1 second.
  */
function checkForLoadBoard() {
  if (window.location.href.indexOf("board") > -1) {
    renderBoard();
    closeAddTaskBoard();
    clearTask();
  } else {
    setTimeout(() => {
      window.location.href = "../html/board.html";
    }, 1000);
  }
}


/**
 * Checks if the event object is valid and prevents the default action.
 * @param {Event} event - The event object.
 * @returns {void}
 */
function proofEvent(event) {
  if (event) {
    event.preventDefault();
  }
}


/**
 * Extracts new task data from the UI and returns it in an object.
 * @async
 * @returns {Promise<Object>} - The new task data in an object.
 */
async function getTaskData() {
  let prioNew = checkPrio('');
  let currentID = allTasks.length;
  let creatorNew = currentUser["name"];
  let titleNew = document.getElementById("title").value;
  let descriptionNew = document.getElementById("description").value;
  let categoryNew = document.getElementById("selectedCategory").innerText;
  let dateNew = document.getElementById("date").value;
  newCreateSubtask = newCreateSubtask.filter(
    (subtask) => !newSubtask.includes(subtask)
  );
  return {
    creator: creatorNew,
    title: titleNew,
    description: descriptionNew,
    category: categoryNew,
    titleBg: currentCategoryColor[0],
    assignedTo: selectedContacts,
    date: dateNew,
    prio: prioNew,
    closedSubtask: newSubtask,
    openSubtask: newCreateSubtask,
    id: currentID,
    area: newArea,
  };
}


/**
 * Validates if the title property is present in the task object. Returns true if the title is present, false otherwise.
 * @param {Object} newTask - The task object to validate.
 * @param {string} Edit - A string indicating the context in which the function is called, either "Task" for creating a new task or "Edit" for editing an existing task.
 * @returns {boolean} - True if the title property is present, false otherwise.
 */
function taskProofSection(newTask) {
  let data = proofTaskData(newTask);
  let title = proofTitle(newTask, "Task");
  let description = proofDescription(newTask, "Task");
  let category = proofCategory(newTask, "Task");
  let assigned = proofAssigned(newTask, "Task");
  let date = proofDate(newTask, "Task");
  let prio = proofPrio(newTask, "Task");
  let subtask = true;
  if (checkProofOf(data, title, description, category, assigned, date, prio, subtask) === true) {
    return true;
  }
  return false;
}


/**
 * Checks if all required fields (title, description, category, assigned, date, prio, subtask) are filled out. Returns true if all fields are filled, false otherwise.
 * @param {Object} data - The object to check.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} category - The category of the task.
 * @param {string} assigned - The assigned user of the task.
 * @param {string} date - The due date of the task.
 * @param {number} prio - The priority of the task.
 * @param {Array} subtask - The subtasks of the task.
 * @returns {boolean} True if all required fields are filled, false otherwise.
 */
function checkProofOf(data, title, description, category, assigned, date, prio, subtask) {
  return (data === true && title === true && description === true && category === true &&
    assigned === true && date === true && prio === true && subtask === true);
}


/**
 * Validates the task object by checking if it contains all required properties.
 * The function checks if the `newTask` object has a valid `creator` property and ensures that the `id` and `area` properties are defined. 
 * If the `creator` property of `newTask` is equal to "Guest User", an alert message is displayed stating that a guest user cannot create a task.
 * If the `id` property of `newTask` is undefined or the `area` property is falsy, the function logs an error message to the console and returns false.
 * @param {Object} newTask - The task object to validate.
 * @returns {boolean} - Returns true if the task object is valid, false otherwise.
 */
function proofTaskData(newTask) {
  if (newTask.creator == "Guest User") {
    alert("The guest user can't create a task.");
    return false;
  }
  if (newTask.id === undefined || !newTask.area) {
    // console.log("proof the id or area undefined");
    return false;
  }
  return true;
}


/**
 * Validates if the title property is present in the task object. Returns true if the title is present, false otherwise.
 * @async
 * @param {Object} newTask - The task object to validate.
 * @param {boolean} Edit - A boolean indicating if the task is being edited.
 * @returns {boolean} - True if the title property is present, false otherwise.
 */
function proofTitle(newTask, Edit) {
  if (!newTask.title) {
    let msgBox = document.getElementById(`msgBoxTitle${Edit}`);
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Checks if a task's description has been provided.
 * @param {Object} newTask - The task object containing the description.
 * @param {string} Edit - A string indicating the context in which the function is called, either "Task" for creating a new task or "Edit" for editing an existing task.
 * @returns {boolean} Returns false if the description is missing, otherwise true.
 */
function proofDescription(newTask, Edit) {
  if (!newTask.description) {
    let msgBox = document.getElementById(`msgBoxDescription${Edit}`);
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Checks if a task's category has been selected and if a background color has been set for the category.
 * @param {Object} newTask - The task object containing the category and titleBg.
 * @param {string} Edit - A string indicating the context in which the function is called, either "Task" for creating a new task or "Edit" for editing an existing task.
 * @returns {boolean} Returns false if the category is missing or the titleBg is not set, otherwise true.
 */
function proofCategory(newTask, Edit) {
  if (newTask.category == "select a category" || newTask.category == "" || !newTask.titleBg) {
    let msgBox = document.getElementById(`msgBoxCategory${Edit}`);
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Validates if the assigned property (selectedContacts) contains at least one contact.
 * @returns {boolean} - Returns false if no contacts are selected, otherwise true.
 */
function proofAssigned() {
  if (selectedContacts.length === 0) {
    let msgBox = document.getElementById("msgBoxAssignedTask");
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Checks if a task's date has been selected.
 * @param {Object} newTask - The task object containing the date.
 * @param {string} Edit - A string indicating the context in which the function is called, either "Task" for creating a new task or "Edit" for editing an existing task.
 * @returns {boolean} Returns false if the date is missing, otherwise true.
 */
function proofDate(newTask, Edit) {
  if (!newTask.date) {
    let msgBox = document.getElementById(`msgBoxDate${Edit}`);
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Checks the priority of a task.
 * @param {string} input - An empty string, used to check if a priority value is set. If not, a default priority is assigned.
 * @returns {number} - Returns the priority value.
 */
function proofPrio(newTask, Edit) {
  if (!newTask.prio) {
    let msgBox = document.getElementById(`msgBoxPrio${Edit}`);
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Checks if a task's subtasks have been added.
 * @returns {boolean} Returns false if no subtasks have been added, otherwise true.
 */
function proofSubtask() {
  if (newSubtask.length === 0 && newCreateSubtask.length === 0) {
    let msgBox = document.getElementById("msgBoxSubtask");
    showRequiredText(msgBox);
    return false;
  }
  return true;
}


/**
 * Shows a message in a specified element indicating that a field is required.
 * @param {Object} msgBox - The element where the message should be displayed.
 */
function showRequiredText(msgBox) {
  msgBox.classList.remove("d-none");
  msgBox.innerHTML = "This field is required";
}


/**
 * Removes the "required" message from the specified container if it's not empty. Otherwise, shows the container.
 * @param {string} id - The ID of the container to check.
 */
function proofInput(id) {
  let requiredContainer = document.getElementById(id);
  if (requiredContainer.innerHTML != "") {
    requiredContainer.classList.add("d-none");
  } else {
    requiredContainer.classList.remove("d-none");
  }
}


/**
 * Adds the new task to the allTasks array and saves it to the backend. Then, displays a popup message and redirects to the board page after 1 second.
 * @async
 * @param {Object} newTask - The new task object to add.
 */
async function setTaskData(newTask) {
  allTasks.push(newTask);
  await backend.setItem("allTasks", allTasks);
  slidePopup.classList.remove("d-none");

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
 * Sets the priority checkbox for the specified priority (low, medium, high) and taskEdit ID.
 * @param {string} prio - The priority string (low, medium, high).
 * @param {string} taskEdit - The edit ID of the task.
 */
function setPrioCheckBox(prio, taskEdit) {
  if (prio === "low") {
    resetAllPrioBtn('medium', 'urgent', taskEdit);
    setLowPrioBtn(taskEdit);
  }
  if (prio === "medium") {
    resetAllPrioBtn('low', 'urgent', taskEdit);
    setNormalPrioBtn(taskEdit);
  }
  if (prio === "urgent") {
    resetAllPrioBtn('low', 'medium', taskEdit);
    setHighPrioBtn(taskEdit);
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
  document.getElementById(`svgLow${taskEdit}`).classList.remove("prioIconWhite");
  document.getElementById(`svgNormal${taskEdit}`).classList.remove("prioIconWhite");
  document.getElementById(`svgHigh${taskEdit}`).classList.remove("prioIconWhite");
  document.getElementById(`lowPrioText${taskEdit}`).style = "color: black;";
  document.getElementById(`normalPrioText${taskEdit}`).style = "color: black;";
  document.getElementById(`highPrioText${taskEdit}`).style = "color: black;";
  document.getElementById(`lowBtnContainer${taskEdit}`).classList.remove("prioLowContainerOnClick");
  document.getElementById(`normalBtnContainer${taskEdit}`).classList.remove("prioNormalContainerOnClick");
  document.getElementById(`highBtnContainer${taskEdit}`).classList.remove("prioHighContainerOnClick");
}


/**
 * Sets the low priority button of a task to checked, and updates the corresponding SVG color,
 * text color, and button color.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setLowPrioBtn(taskEdit) {
  let lowBtn = document.getElementById(`lowBtn${taskEdit}`);
  lowBtn.checked = true;
  setLowPrioSvgColor(taskEdit);
  setLowPrioTextColor(taskEdit);
  setLowPrioBtnColor(taskEdit);
}


/**
 * Sets the medium priority button of a task to checked, and updates the corresponding SVG color,
 * text color, and button color.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setNormalPrioBtn(taskEdit) {
  let mediumBtn = document.getElementById(`mediumBtn${taskEdit}`);
  mediumBtn.checked = true;
  setNormalPrioSvgColor(taskEdit);
  setNormalPrioTextColor(taskEdit);
  setNormalPrioBtnColor(taskEdit);
}


/**
 * Sets the medium priority button of a task to checked, and updates the corresponding SVG color,
 * text color, and button color.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setHighPrioBtn(taskEdit) {
  let urgentBtn = document.getElementById(`urgentBtn${taskEdit}`);
  urgentBtn.checked = true;
  setHighPrioSvgColor(taskEdit);
  setHighPrioTextColor(taskEdit);
  setHighPrioBtnColor(taskEdit);
}


/**
 * Adds the CSS class 'prioIconWhite' to the low priority SVG icon of a task, changing its color to white.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setLowPrioSvgColor(taskEdit) {
  let svgLowColor = document.getElementById(`svgLow${taskEdit}`);
  svgLowColor.classList.add("prioIconWhite");
}


/**
 * Changes the text color of the low priority button to white.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setLowPrioTextColor(taskEdit) {
  let lowPrioText = document.getElementById(`lowPrioText${taskEdit}`);
  lowPrioText.style = "color: white;";
}


/**
 * Adds the CSS class 'prioLowContainerOnClick' to the low priority button container, changing its color.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setLowPrioBtnColor(taskEdit) {
  let lowContainer = document.getElementById(`lowBtnContainer${taskEdit}`);
  lowContainer.classList.add("prioLowContainerOnClick");
}


/**
 * Adds the CSS class 'prioIconWhite' to the medium priority SVG icon of a task, changing its color to white.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setNormalPrioSvgColor(taskEdit) {
  let svgNormalColor = document.getElementById(`svgNormal${taskEdit}`);
  svgNormalColor.classList.add("prioIconWhite");
}


/**
 * Changes the text color of the medium priority button to white.
 * @param {number} taskEdit - The ID of the task being edited.
 */
function setNormalPrioTextColor(taskEdit) {
  let normalPrioText = document.getElementById(`normalPrioText${taskEdit}`);
  normalPrioText.style = "color: white;";
}


/**
 * Sets the color of the normal priority button and its container to indicate it is selected.
 * @param {string} taskEdit - The ID of the task being edited.
 */
function setNormalPrioBtnColor(taskEdit) {
  let normalBtnContainer = document.getElementById(`normalBtnContainer${taskEdit}`);
  normalBtnContainer.classList.add("prioNormalContainerOnClick");
}

/**
 * Sets the color of the high priority icon to indicate it is selected.
 * @param {string} taskEdit - The ID of the task being edited.
 */
function setHighPrioSvgColor(taskEdit) {
  let svgHighColor = document.getElementById(`svgHigh${taskEdit}`);
  svgHighColor.classList.add("prioIconWhite");
}


/**
 * Sets the color of the high priority text to white to indicate it is selected.
 * @param {string} taskEdit - The ID of the task being edited.
 */
function setHighPrioTextColor(taskEdit) {
  let highPrioText = document.getElementById(`highPrioText${taskEdit}`);
  highPrioText.style = "color: white;";
}


/**
 * Sets the color of the high priority button and its container to indicate it is selected.
 * @param {string} taskEdit - The ID of the task being edited.
 */
function setHighPrioBtnColor(taskEdit) {
  let highBtnContainer = document.getElementById(`highBtnContainer${taskEdit}`);
  highBtnContainer.classList.add("prioHighContainerOnClick");
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