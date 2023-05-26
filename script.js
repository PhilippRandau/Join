setURL("https://philipp-randau.developerakademie.net/Join/smallest_backend_ever");
let users = [];
let currentUser = [];
let allTasks = [{ id: 0 }];
let categoryColor = [];


/**
 * This function is used to load all important functions that is used on every site at the beginning.
 */
async function init() {
    await initTemplates();
    await loadTasks();
    await loadCurrentUser();
    setSideBarFocus();
    getInitialForHeader()
    checkUndefined()
}


/**
 * Initializes the Help & Legal page by loading necessary data and setting focus on the sidebar.
 */
async function initHelpLegal() {
    await initTemplates();
    await loadCurrentUser();
    setSideBarFocus()
    getInitialForHeader()
}


/**
 * Returns the current date in ISO format (yyyy-mm-dd).
 * @returns {string} - The current date in ISO format.
 */
function dateTodayISO() {
    let dateToday = new Date().getFullYear() + '-' + pad((new Date().getMonth() + 1), 2) + '-' + new Date().getDate();
    return dateToday;
}


/**
 * Returns a boolean indicating whether the current window width is less than or equal to 1000 pixels, indicating a mobile device.
 * @returns {boolean} - True if the window width is less than or equal to 1000 pixels, false otherwise.
 */
function mobileWidth(){
    return window.innerWidth <= 1000;
}

/**
 * Pads a given number with leading zeroes to a specified length.
 * @param {number} num - The number to pad.
 * @param {number} size - The desired length of the resulting string.
 * @returns {string} - The padded number as a string.
 */
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function slideAnimation(childID, parentID, visualDir1, visualDir2, slideDirBottom1, slideDirBottom2, slideDir1, slideDir2){
    document.getElementById(parentID).classList.remove(visualDir1);
    document.getElementById(parentID).classList.add(visualDir2);
    if (mobileWidth()) {
        document.getElementById(childID).classList.add(slideDirBottom1);
        document.getElementById(childID).classList.remove(slideDirBottom2);
        if (childID == 'addTask') {
            document.getElementById(childID).classList.remove(slideDirBottom1);
            document.getElementById(childID).classList.remove(slideDir1);
            document.getElementById(childID).classList.add(slideDir2);
            document.getElementById(parentID).classList.remove(visualDir2);
        }
    } else {
        document.getElementById(childID).classList.remove(slideDir1);
        document.getElementById(childID).classList.add(slideDir2);
    }
}
/**
 * Animates the sliding in of a child element within a parent element.
 * @param {string} childID - The ID of the child element to slide in.
 * @param {string} parentID - The ID of the parent element to slide into.
 */
// function slideInAnimation(childID, parentID) {
//     document.getElementById(parentID).classList.remove('visual-out');
//     document.getElementById(parentID).classList.add('visual-in');
//     if (mobileWidth()) {
//         document.getElementById(childID).classList.add('slide-in-bottom');
//         document.getElementById(childID).classList.remove('slide-out-bottom');
//         if (childID == 'addTask') {
//             document.getElementById(childID).classList.remove('slide-in-bottom');
//             document.getElementById(childID).classList.remove('slide-out');
//             document.getElementById(childID).classList.add('slide-in');
//             document.getElementById(parentID).classList.remove('visual-in');
//         }
//     } else {
//         document.getElementById(childID).classList.remove('slide-out');
//         document.getElementById(childID).classList.add('slide-in');
//     }
// }


// function slideOutAnimation(childID, parentID) {
//     document.getElementById(parentID).classList.remove('visual-in');
//     document.getElementById(parentID).classList.add('visual-out');
//     if (mobileWidth()) {
//         document.getElementById(childID).classList.remove('slide-in-bottom');
//         document.getElementById(childID).classList.add('slide-out-bottom');
//         if (childID == 'addTask') {
//             document.getElementById(childID).classList.remove('slide-out-bottom');
//             document.getElementById(childID).classList.remove('slide-in');
//             document.getElementById(childID).classList.add('slide-out');
//             document.getElementById(parentID).classList.remove('visual-out');
//         }
//     } else {
//         document.getElementById(childID).classList.remove('slide-in');
//         document.getElementById(childID).classList.add('slide-out');
//     }
// }

/**
 * Checks if the initialLetters property of the currentUser object is undefined, and reloads the current page if it is
 */
function checkUndefined() {
    if (currentUser.initialLetters === undefined) {
        location.reload();
    }
}
