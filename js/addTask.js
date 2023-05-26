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
 * Checks the proof of a task section.
 * @param {object} newTask - The new task object.
 * @returns {boolean} - Returns true if the proof of all task sections is successful, false otherwise.
 */
function taskProofSection(newTask) {
  let data = proofTaskData(newTask);
  let title = proofSections(!newTask.title, "Task", 'Title')
  let description = proofSections(!newTask.description, "Task", 'Description')
  let category = proofSections(conditionProofCategory(newTask), "Task", 'Category')
  let assigned = proofSections(selectedContacts.length === 0, "Task", 'Assigned')
  let date = proofSections(!newTask.date, "Task", 'Date')
  let prio = proofSections(!newTask.prio, "Task", 'Prio')

  let subtask = true;
  if (checkProofOf(data, title, description, category, assigned, date, prio, subtask) === true) {
    return true;
  }
  return false;
}


/**
 * Checks the condition for proof of the category section.
 * @param {object} newTask - The new task object.
 * @returns {boolean} - Returns true if the condition for proof of the category section is met, false otherwise.
 */
function conditionProofCategory(newTask) {
  return newTask.category == "select a category" || newTask.category == "" || !newTask.titleBg;
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
    return false;
  }
  return true;
}


/**
 * Checks the proof of a specific section.
 * @param {boolean} condition - The condition to check for the proof of the section.
 * @param {string} edit - The identifier for the edit action.
 * @param {string} section - The section being checked.
 * @returns {boolean} - Returns true if the proof of the section is successful, false otherwise.
 */
function proofSections(condition, edit, section) {
  if (condition) {
    let msgBox = document.getElementById(`msgBox${section}${edit}`);
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