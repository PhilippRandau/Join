let previousID = null;
let isAddTask = false;


/**
 * Sets the focus on the sidebar menu based on the current page URL path.
 */
function setSideBarFocus() {
    let sectionPathname = window.location.pathname;
    let sections = sectionPathname.split('/');
    let sectionName = sections[sections.length - 1].replace('.html', '');
    ifSummarySite(sectionName);
    ifBoardSite(sectionName);
    ifAddTaskSite(sectionName);
    ifContactsSite(sectionName);
    ifLegalSite(sectionName);
    ifHelpSite(sectionName);
}

/**
 * Sets the focus on the "Summary" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifSummarySite(sectionName) {
    if (sectionName === "summary") {
        setTimeout(() => {
            setFocus("summary", "Side");
        }, 50);

        showGreetingUser();
    }
}

/**
 * Sets the focus on the "board" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifBoardSite(sectionName) {
    if (sectionName === "board") {
        setFocus("board", "Side");
    }
}

/**
 * Sets the focus on the "addTask" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifAddTaskSite(sectionName) {
    if (sectionName === "addTask") {
        setTimeout(() => {
            setFocus("addTask", "Side");
        }, 50);
        isAddTask = true;
    }
}

/**
 * Sets the focus on the "contacts" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifContactsSite(sectionName) {
    if (sectionName === "contacts") {
        setTimeout(() => {
            setFocus("contacts", "Side");
        }, 50);
    }
}

/**
 * Sets the focus on the "legal" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifLegalSite(sectionName) {
    if (sectionName === "legal" && window.innerWidth > 1000) {
        setTimeout(() => {
            setFocus("legal", "Side");
        }, 10);
    }
}

/**
 * Sets the focus on the "help" section in the sidebar menu and displays the user greeting message.
 * @param {string} sectionName - The name of the current section in the page URL path.
 */
function ifHelpSite(sectionName) {
    if (sectionName === "help") {
        let icon = document.getElementById('helpIcon')
        icon.classList.add('d-none')
    }
}

/**
 * Sets focus on a specific section and contact container, optionally remembering the previously selected ID.
 *
 * @function setFocus
 * @param {string} id - The ID of the section to set focus on.
 * @param {number} selectedID - The ID of the contact container to set focus on.
 */
function setFocus(id, selectedID) {
    if (id !== 'contactContainer') {
        setFocusSideSection(id, selectedID);
    }

    setFocusContactContainer(id, selectedID);
    if (!isNaN(selectedID)) {
        previousID = selectedID;
    }
}

/**
 * Sets focus on a specific sidebar section, highlighting the selected contact container and removing the highlight from the previously selected contact container.
 * @param {string} id - The ID of the sidebar section to set focus on.
 * @param {number} selectedID - The ID of the contact container to set focus on.
 */
function setFocusSideSection(id, selectedID) {
    document.getElementById(`${id}${selectedID}`).focus();
    document.getElementById(`${id}${selectedID}`).classList.add("focusSidebar");
}

/**
 * Sets focus on a specific contact container, highlighting it and removing the highlight from the previously selected contact container.
 * @param {string} id - The ID of the contact container to set focus on.
 * @param {number} selectedID - The ID of the contact container to set focus on.
 */
async function setFocusContactContainer(id, selectedID) {
    document.getElementById(`${id}${selectedID}`).focus();
    document.getElementById(`${id}${selectedID}`).classList.add("focusContact");
    document.getElementById(`${id}${selectedID}`).classList.remove("contactContainerhover");
    if (previousID !== null && previousID !== selectedID) {
        try {
            document.getElementById(`${id}${previousID}`).classList.remove("focusContact");
            document.getElementById(`${id}${previousID}`).classList.add("contactContainerhover");
            document.getElementById(`contactBubble${previousID}`).classList.remove("contactsBubbleBorder");
            document.getElementById(`${id}${selectedID}`).classList.remove("focusSidebar");
        } catch (error) {

        }
    }
}

/**
 * Toggles the visibility of the logout container and adds a click event listener to the document to detect clicks outside of the container.
 */
function openLogout() {
    let logoutContainer = document.getElementById('headerPopupDiv')
    logoutContainer.classList.toggle('d-none')
    document.addEventListener('click', handleClickOutside)
}


/**
 * Handles click events outside of the logout container and hides the container if the click is outside of it.
 * @param {Event} e - The click event object.
 */
function handleClickOutside(e) {//Die Funktion handleClickOutside wird aufgerufen, wenn es einen Klick gibt.
    let logoutContainer = document.getElementById('headerPopupDiv')//Der DOM-Element mit der ID headerPopupDiv wird in der Variable logoutContainer gespeichert.
    if (!e.target.closest('#headerPopupDiv') && !e.target.closest('#currentUserInitials')) {//Dann wird geprüft, ob das Element, auf das geklickt wurde, innerhalb des "headerPopupDiv"-Elements oder des "currentUserInitials"-Elements liegt. Wenn ja, wird nichts weiter gemacht.
        logoutContainer.classList.add('d-none')//  Wenn das geklickte Element nicht innerhalb dieser beiden Elemente liegt, wird die CSS-Klasse "d-none" dem "logoutContainer"-Element hinzugefügt, um es auszublenden.
        document.removeEventListener('click', handleClickOutside)//  Schließlich wird der Event-Listener für das "click"-Event entfernt, um zu verhindern, dass die Funktion erneut aufgerufen wird, wenn auf der Seite geklickt wird.
    }
}

/**
 * Logs out the current user, removes the user from local storage, and redirects the user to the index page with a success message in the query string.
 */
function logout() {
    currentUser = ""
    localStorage.removeItem("currentUser")
    window.location.href = `../index.html?msg=Your Logout was successful`;
}


/**
 *     This function generates the initial letter of the current user's name and adds it to the header.
 */
function getInitialForHeader() {
    const initialLetters = currentUser.initialLetters;
    const color = currentUser.color;
    currentUserInitials.innerHTML = `
      <div onclick="openLogout()" style="background:${color}">${initialLetters}</div>
    `;
}


/**
 *     This function redirects the user to the contacts.html page with a query parameter 'edit' that has the name of the current user.

 */
function goToEdit() {
    const name = currentUser.name;
    window.location.href = `contacts.html?edit=${name}`;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const nameToEdit = (getQueryParam('edit'));

if (nameToEdit) {
    setTimeout(() => {
        openContact('contactContainer', 0);
        openEditContact(0)
    }, 350);
}


/**
 * Displays the "Create Task" button on mobile devices if the screen width is less than or equal to the mobile breakpoint and the "Add Task" button is currently displayed.
 */
function showCreateTaskBtnMobile() {
    let mobileBtn = document.getElementById('createTaskBtnMobile')
    let bubbleDiv = document.getElementById('loginContainer')
    if (mobileWidth() && isAddTask) {
        bubbleDiv.classList.add('d-none')
        mobileBtn.innerHTML = `
        <div onclick="createNewTask(event);">
            <button class="blueBtn">Create Task <img src="../assets/img/check.svg"></button>
        </div>`
    }
}


/**
 * Hides the "Create Task" button on mobile devices by removing it from the DOM and displaying the login bubble again.
 *
 * @function hideCreateTaskBtnMobile
 * @returns {void}
 */
function hideCreateTaskBtnMobile() {
    let mobileBtn = document.getElementById('createTaskBtnMobile')
    let bubbleDiv = document.getElementById('loginContainer')
    bubbleDiv.classList.remove('d-none')
    mobileBtn.innerHTML = ""
    isAddTask = false;
}


/**
 * Sets focus on the contact bubble with the given ID and adds a border to it.
 * @param {number} selectedID - The ID of the contact bubble to focus on.
 */
function setFocusBubbleContact(selectedID) {
    document.getElementById(`contactBubble${selectedID}`).focus();
    document.getElementById(`contactBubble${selectedID}`).classList.add("contactsBubbleBorder");
}