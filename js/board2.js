/**
 * Renders the Kanban board by filtering and searching tasks based on the current input value in the 'find-task' search field.
 * The function clears the content of each board area before rendering the filtered and searched tasks.
 * @throws {Error} - If there are no tasks created, a console message is logged and the error is thrown.
 */
function renderBoard() {
    let taskInput = document.getElementById('find-task');
    inputValueLC = taskInput.value.toLowerCase();
    let areaToDoID = document.getElementById('tasks-to-do');
    let areaInProgressID = document.getElementById('tasks-in-progress');
    let areaAwaitingFeedbackID = document.getElementById('tasks-awaiting-feedback');
    let areaDoneID = document.getElementById('tasks-done');
    areaToDoID.innerHTML = "";
    areaInProgressID.innerHTML = "";
    areaAwaitingFeedbackID.innerHTML = "";
    areaDoneID.innerHTML = "";
    try {
        filterAndSearch("todo", areaToDoID);
        filterAndSearch("inProgress", areaInProgressID);
        filterAndSearch("awaitingFeedback", areaAwaitingFeedbackID);
        filterAndSearch("done", areaDoneID);
    } catch (error) {
        // console.log('no Tasks created');
    }
}


/**
 * This function is used to filter and search tasks and call the 'renderCreatedTasks' function.
 * @param {string} area - Identifies the area.
 * @param {string} areaID - The ID of the area section.
 */
function filterAndSearch(area, areaID) {
    let areaArray = allTasks.filter((t) => t["area"] == area);
    for (let i = 0; i < areaArray.length; i++) {
        const task = areaArray[i];
        const taskCategory = task['category'].toLowerCase();
        const taskDescription = task['description'].toLowerCase();
        const taskTitle = task['title'].toLowerCase();
        if (taskCategory.includes(inputValueLC) || taskDescription.includes(inputValueLC) || taskTitle.includes(inputValueLC) || inputValueLC == '') {
            renderCreatedTasks(areaID, task);
        }
    }
}


/**
 * This function is used to render the filtered and searched tasks on the board.
 * @param {Element} area - Identifies the area.
 * @param {Object} task - Information of the current rendering task.
 */
async function renderCreatedTasks(area, task) {
    area.innerHTML += renderCreatedTasksInnerHTML(task);
    renderAssignTo(task, 'task-assigned-to');
    checkValueOfSubtasks(task);
    setTitleBg(task, 'task-category');
}


/**
 * This function is used to render the AssignTo bubbles of the users.
 * @param {Object} task - Information of the current rendering task.
 * @param {string} eID - ID of the div that should be rendered the AssignTo bubble in.
 */
function renderAssignTo(task, eID) {
    let i;
    for (i = 0; i < task['assignedTo'].length; i++) {
        const assignedTo = task['assignedTo'][i]['initial'];
        if (eID == 'task-assigned-to' && i < 2 || eID != 'task-assigned-to') {
            document.getElementById(`${eID}${task['id']}`).innerHTML += `<div style="background-color:${task['assignedTo'][i]['color']};">${assignedTo}</div>`;
        }
        if (eID == 'task-details-assigned-to') {
            document.getElementById(`task-details-assigned-to-name${task['id']}`).innerHTML += `<div>${task['assignedTo'][i]['name']}</div>`;
        }
    }
    if (eID == 'task-assigned-to' && i > 2) {
        document.getElementById(`task-assigned-to${task['id']}`).innerHTML += `<div style="background-color:#2A3647;">${i - 2}+</div>`;
    }
}


/**
 * This function is used to calculate the actual progress of the finished subtasks.
 * @param {Object} task - Information of the current rendering task.
 * @returns The progress of the subtasks in %.
 */
function progressSubtasks(task) {
    if (task['closedSubtask'] == 0) {
        return 0;
    } else {
        return 100 / (task['openSubtask'].length + task['closedSubtask'].length) * task['closedSubtask'].length;
    }
}

//---------------------------Move to Area Mobile---------------------------
/**
 * Hides the "move to" button for the current task's current area on mobile, to avoid duplicating it
 * @param {string} taskID - the ID of the current task being moved
 */
function selectAreaOnMobile(taskID) {
    let moveToButtonIDs = ['mobile-move-todo', 'mobile-move-inProgress', 'mobile-move-awaitingFeedback', 'mobile-move-done'];
    for (let i = 0; i < moveToButtonIDs.length; i++) {
        const moveToButtonID = moveToButtonIDs[i];
        if (moveToButtonID.includes(allTasks[taskID]['area'])) {
            document.getElementById(moveToButtonID).style.display = 'none';
        }
    }
}


/**
 * Moves the specified task to the selected area on mobile, updates the board and saves to backend
 * @param {string} taskID - the ID of the task being moved
 * @param {string} selectedArea - the area the task is being moved to
 */
function moveToOnMobile(taskID, selectedArea) {
    allTasks[taskID]['area'] = selectedArea;
    renderBoard();
    openTaskDetailsFront(taskID);
    selectAreaOnMobile(taskID);
    backend.setItem("allTasks", allTasks);
}