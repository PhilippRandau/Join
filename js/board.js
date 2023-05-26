
let currentDraggedElement;
let currentAreaOndragover;
let taskPreview;
let newArea;
let currentTaskID;

/**
 * This function is used to initialise all functions thats needed for the board page.
 */
async function initBoard() {
    await init();
    await loadUsers();
    renderBoard();
}


//---------------------------Drag and Drop Tasks---------------------------

/**
 * Allows dropping a dragged element onto an area and updates the current area on dragover.
 * If the area is different from the current area of the dragged element and taskPreview is false,
 * highlights the area by showing a task preview. If the area is the same and a task preview is shown,
 * removes the task preview.
 * @param {Event} ev - The drag event.
 * @param {string} area - The area where the element is being dragged to.
 * @param {string} areaID - The ID of the area element.
*/
function allowDrop(ev, area, areaID) {
    ev.preventDefault();
    currentAreaOndragover = area;
    if (area != allTasks[currentDraggedElement]['area'] && taskPreview == false) {
        if (document.getElementById('task-preview') != null) {
            document.getElementById('task-preview').remove();
        }
        highlightArea(areaID);
    } else if (area == allTasks[currentDraggedElement]['area'] && document.getElementById('task-preview') != null) {
        document.getElementById('task-preview').remove();
    }
}


/**
 * This function is used to remove the task preview task.
 */
function disregardArea() {
    taskPreview = false;
}


/**
 * This function is used to highlight the dragged over area with a preview style of a task.
 * @param {string} areaID - Element ID of a area.
 */
function highlightArea(areaID) {
    document.getElementById(`${areaID}`).innerHTML += `<div class="task-preview" id="task-preview"></div>`;
    checkDraggedTaskSize();
    taskPreview = true;
}


/**
 * This function is used to set the current tasks id global.
 * @param {string} id - The dragged tasks id.
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * Checks the size of the current dragged task element and sets the minimum height of the task preview element to match it.
 */
function checkDraggedTaskSize() {
    let task = document.getElementById(`taskNumber_${currentDraggedElement}`);
    let actTaskHeight = task.offsetHeight;
    document.getElementById('task-preview').style.minHeight = actTaskHeight + 'px';
}


/**
 * Moves the current dragged task element to the designated area and updates the board with the new order of tasks.
 */
async function moveTo() {
    allTasks[currentDraggedElement]['area'] = currentAreaOndragover;
    renderBoard();
    await backend.setItem("allTasks", allTasks);
}


/**
 * Sets the background color of the specified task element based on its "titleBg" property.
 * @param {Object} task - The task object for which to set the background color.
 * @param {string} eID - The ID of the element to set the background color on.
 */
function setTitleBg(task, eID) {
    document.getElementById(`${eID}${task['id']}`).style.backgroundColor = `${task['titleBg']}`;
}


/**
 * Applies a CSS animation to a dragged task.
 * @param {number} id - The id of the task being dragged.
 */
function dragAnimation(id) {
    document.getElementById(`taskNumber_${id}`).style.rotate = '4deg';
    document.getElementById(`taskNumber_${id}`).style.opacity = '0.75';
}


/**
 * Adds a task to a board and displays a popup window for creating the task.
 * @param {string} area - The name of the board, where the task will be added.
 */
function addTaskBoard(area) {
    isAddTask = true;
    document.getElementById("addTask").innerHTML = addTaskHTML();
    selectArea(area);
    slideAnimation('addTask', 'popup-add-task-board', 'visual-out', 'visual-in', 'slide-in-bottom', 'slide-out-bottom', 'slide-out', 'slide-in');
    document.getElementById('popup-add-task-board').classList.remove('d-none');
    addTaskCloseTopRight();
    document.getElementById('close-add-task').innerHTML = addTaskHTMLBoard();
    navbarBottomHide();
    showCreateTaskBtnMobile();
    preventScrolling();

}


/**
 * Disables scrolling on the body element to prevent the user from scrolling while a popup window is open.
 */
function preventScrolling() {
    return body.style.overflow = "hidden";
}


/**
 * Sets the current board area where a new task will be added.
 * @param {string} area - The name of the board area.
 */
function selectArea(area) {
    newArea = area;
}


/**
 * Closes the Add Task Board by sliding it out of view and adding a delay for the animation to finish.
 * Restores the navbar and the Create Task button for mobile view.
 * Allows the user to scroll again.
 */
function closeAddTaskBoard() {
    slideAnimation('addTask', 'popup-add-task-board', 'visual-in', 'visual-out', 'slide-out-bottom', 'slide-in-bottom', 'slide-in', 'slide-out');
    setTimeout(() => {
        document.getElementById('popup-add-task-board').classList.add('d-none');
    }, animationTimeout);
    if (mobileWidth()) {
        let navbar = document.getElementById('navbar-bottom')
        navbar.classList.remove("d-none")
        hideCreateTaskBtnMobile();
    }
    allowScrolling();
}


/**
 * Allows the user to scroll again by setting the body's overflow property to "auto".
 * @returns - body.style.overflow = "auto"
 */
function allowScrolling() {
    return body.style.overflow = "auto";
}


/**
 * Prevents the Add Task Board from closing when the user clicks inside it by stopping the propagation of the event.
 * @param {Event} event - The click event that triggered the function.
 */
function doNotCloseAddTaskBoard(event) {
    event.stopPropagation();
}


//---------------------------Details Tasks---------------------------
/**
 * Displays the task details popup and renders the task details in it.
 * @param {number} taskID - The ID of the task to display details for. 
 */
function openTaskDetailsFront(taskID) {
    currentTaskID = taskID;
    document.getElementById('popup-task-details').classList.remove('d-none');
    slideAnimation('task-details', 'popup-task-details', 'visual-out', 'visual-in', 'slide-in-bottom', 'slide-out-bottom', 'slide-out', 'slide-in');
    document.getElementById('task-details').innerHTML = renderTaskDetailsFrontHTML(currentTaskID);
    preventScrolling();
    setTitleBg(allTasks[currentTaskID], 'task-details-category');
    renderAssignTo(allTasks[currentTaskID], 'task-details-assigned-to');
    renderSubtasks(allTasks[currentTaskID], 'task-details-subtasks');
    setPriorityBg();
}


/**
 * Renders the subtasks of a given task in the specified HTML element.
 * @param {object} task - The task object containing the subtasks to render.
 * @param {string} eID - The ID of the HTML element to render the subtasks in.
 */
function renderSubtasks(task, eID) {
    document.getElementById(`${eID}${task['id']}`).innerHTML = '';

    for (let i = 0; i < task['openSubtask'].length; i++) {
        const openSubtask = task['openSubtask'][i];
        document.getElementById(`${eID}${task['id']}`).innerHTML += /*html*/`
         <div class="subtasks-details"><input class="checkbox-subtask" onclick="statusSubtask(${i}, 'openSubtask${i}_T${currentTaskID}')" type="checkbox" id="openSubtask${i}_T${currentTaskID}">${openSubtask}</div>
        `;
    }
    for (let i = 0; i < task['closedSubtask'].length; i++) {
        const closedSubtask = task['closedSubtask'][i];
        document.getElementById(`${eID}${task['id']}`).innerHTML += /*html*/`
        <div class="subtasks-details"><input class="checkbox-subtask" checked onchange="statusSubtask(${i}, 'closedSubtask${i}_T${currentTaskID}')" type="checkbox" id="closedSubtask${i}_T${currentTaskID}">${closedSubtask}</div>
        `;
    }
}


/**
 * This asynchronous function updates the status of a subtask and re-renders the subtask list and board.
 * @param {number} i - Index of the subtask to be updated.
 * @param {string} subtaskID - The ID of the subtask element in the HTML.
 */
async function statusSubtask(i, subtaskID) {
    let statusSubtask = document.getElementById(subtaskID);
    if (statusSubtask.checked) {
        allTasks[currentTaskID]['closedSubtask'].push(allTasks[currentTaskID]['openSubtask'][i]);
        allTasks[currentTaskID]['openSubtask'].splice(i, 1);
    } else {
        allTasks[currentTaskID]['openSubtask'].push(allTasks[currentTaskID]['closedSubtask'][i]);
        allTasks[currentTaskID]['closedSubtask'].splice(i, 1);
    }

    renderSubtasks(allTasks[currentTaskID], 'task-details-subtasks');
    renderBoard();
    await backend.setItem("allTasks", allTasks);
}


/**
 * This function sets the background color of the task priority sign based on the priority level of the current task.
 */
function setPriorityBg() {
    document.getElementById(`task-details-prio-sign${currentTaskID}`).style.backgroundColor = `${setPriorityBgColor()}`;
}


/**
 * This function returns the background color for the priority sign based on the priority level of the current task.
 * @returns {string} The background color for the priority sign as a string.
 */
function setPriorityBgColor() {
    switch (allTasks[currentTaskID]['prio']) {
        case 'low':
            return '#7AE229'
        case 'medium':
            return '#FFA800'
        case 'urgent':
            return '#FF3D00'
        default:
            break;
    }
}

/**
 * Closes the task details popup and restores the body's overflow to 'auto'.
 */
function closeTaskDetails() {
    document.getElementById('body').style.overflow = 'auto';
    slideAssignTo = false;
    slideCategory = false;
    slideAnimation('task-details', 'popup-task-details', 'visual-in', 'visual-out', 'slide-out-bottom', 'slide-in-bottom', 'slide-in', 'slide-out');
    setTimeout(() => {
        document.getElementById('popup-task-details').classList.add('d-none');
    }, animationTimeout);
}

/**
 * Renders the task details popup with an editable form to edit the task's details.
 */
function editDetailsTask() {
    document.getElementById('task-details').innerHTML = renderEditDetailsTaskHTML();
    renderSelectContactEdit();
    renderOpenAssignedTo('contactsEdit', 'contactInitialsEdit');
    setPrioCheckBox(allTasks[currentTaskID]['prio'], 'Edit');
}


/**
 * Renders the HTML for the select contact dropdown menu in the edit task details popup.
 */
function renderSelectContactEdit() {
    let contactInitials = document.getElementById('contactInitialsEdit');
    contactInitials.innerHTML = ``;
    for (let i = 0; i < allTasks[currentTaskID]['assignedTo'].length; i++) {
        let color = allTasks[currentTaskID]['assignedTo'][i]['color'];
        let initialLetters = allTasks[currentTaskID]['assignedTo'][i]['initial'];
        contactInitials.innerHTML += renderSelectContactHTML(color, initialLetters);
    }
}


/**
 * Checks the value of openSubtask and closedSubtask arrays of a task and removes the task subtasks section from the DOM if the sum of both arrays is 0.
 * @param {object} task - The task object to check its subtasks value.
 */
function checkValueOfSubtasks(task) {
    if (task['openSubtask'].length + task['closedSubtask'].length == 0) {
        document.getElementById(`task-subtasks${task['id']}`).remove();
    }
}


/**
 * Edits an existing task with the data entered in the edit task form and updates it in the allTasks array.
 * @param {Event} event - The event object that triggered the function.
 */
function editExistingTask(event) {
    proofEvent(event);
    let editTask = getTaskDataEdit();
    let proof = taskProofSectionEdit(editTask);
    if (proof === true) {
        editTaskData(editTask);
    }
    selectedContacts = [];
}


/**
 * Gets the data entered in the edit task form and returns an object with the values.
 * @returns {object} - An object with the values entered in the edit task form.
 */
function getTaskDataEdit() {
    let titleEdit = document.getElementById("titleEdit").value;
    let descriptionEdit = document.getElementById("descriptionEdit").value;
    let dateEdit = document.getElementById("dateEdit").value;
    let prioEdit = checkPrio('Edit');
    return {
        title: titleEdit,
        description: descriptionEdit,
        assignedTo: selectedContacts,
        date: dateEdit,
        prio: prioEdit,
    };
}


/**
 * Checks if the input values entered in the edit task form are valid, and returns true if they are.
 * @param {object} editTask - An object with the edited task values entered in the form.
 * @returns {boolean} - true if all input values are valid, false otherwise.
 */
function taskProofSectionEdit(editTask) {
    let title = proofSections(!editTask.title, "Edit", 'Title')
    let description = proofSections(!editTask.description, "Edit", 'Description')
    let assigned = proofSections(selectedContacts.length === 0, "Edit", 'Assigned')
    let date = proofSections(!editTask.date, "Edit", 'Date')
    let prio = proofSections(!editTask.prio, "Edit", 'Prio')
    if (checkProofOfEdit(title, description, assigned, date, prio) === true) {
        return true;
    } else {
        return false;
    }
}


/**
 * Checks if all proof conditions are met and returns true if they are.
 * @param {boolean} title - The title proof result.
 * @param {boolean} description - The description proof result.
 * @param {boolean} assigned - The assigned proof result.
 * @param {boolean} date - The date proof result.
 * @param {boolean} prio - The priority proof result.
 * @returns {boolean} - true if all proof conditions are met, false otherwise.
 */
function checkProofOfEdit(title, description, assigned, date, prio) {
    return (
        title === true &&
        description === true &&
        assigned === true &&
        date === true &&
        prio === true
    );
}


/**
 * Edits the task data in the allTasks array with the data entered in the edit task form, saves it in the backend, and re-renders the board.
 * @param {object} editTask - An object with the edited task values entered in the form.
 */
async function editTaskData(editTask) {
    allTasks[currentTaskID]['title'] = editTask['title'];
    allTasks[currentTaskID]['description'] = editTask['description'];
    allTasks[currentTaskID]['date'] = editTask['date'];
    allTasks[currentTaskID]['prio'] = editTask['prio'];
    allTasks[currentTaskID]['assignedTo'] = editTask['assignedTo'];
    await backend.setItem("allTasks", allTasks);
    renderBoard();
    closeTaskDetails();
}


