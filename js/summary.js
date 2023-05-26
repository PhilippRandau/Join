let today = new Date();

/**
 * This function is used to initialise all functions thats needed for the summary page.
 * 
 */
async function initSummary() {
  await init();
  showGreetingDayTime();
  showGreetingUser();
  loadTasksLength();
}

/**
 * This function is used to show the greeting of the daytime to the user thats logged in.
 */
function showGreetingDayTime() {
  let greeting = document.getElementById("greeting");
  let localHours = new Date().getHours();
  setTimeout(() => {
    if (localHours >= 0 && localHours < 5) {
      greeting.innerHTML = 'Hello, ';
    } else if (localHours >= 5 && localHours <= 11) {
      greeting.innerHTML = 'Good Morning, ';
    } else if (localHours >= 12 && localHours <= 17) {
      greeting.innerHTML = 'Good Afternoon, ';
    } else if (localHours >= 17 && localHours <= 23) {
      greeting.innerHTML = 'Good Evening, ';
    }
  }, 100);
}

/**
 * This function is used to show the name of the user as a greeting.
 */
function showGreetingUser() {
  let greetingName = document.getElementById("greeting-user");
  setTimeout(() => {
    greetingName.innerHTML = currentUser["name"];
  }, 300);

  let welcomeTimeout = setTimeout(function () {
    if (!mobileWidth()) {
      document.querySelector('.welcome').style.display = 'flex';
      clearTimeout(welcomeTimeout);
    } else {
      document.querySelector('.welcome').style.display = 'none';
    }
  }, 2300);
}


/**
 * This function is used to load and show the number of tasks, that is in every section.
 */
function loadTasksLength() {
  let countTimeout = 1700;
  loadTaskUpcomingDeadline();
  if (!mobileWidth()) {
    countTimeout = 0;
  }
  setTimeout(function () {
    loadTasksInSummary('', 'tasks-in-board');
    loadTasksInSummary('inProgress', 'tasks-in-progress');
    loadTasksInSummary('awaitingFeedback', 'tasks-awaiting-feedback');
    loadTasksInSummary('todo', 'tasks-todo');
    loadTasksInSummary('done', 'tasks-done');
  }, countTimeout);
}

/**
 * This function is used to count every task amount from 0 to the actual task value in that section.
 * @param {int} num - This is the amount of the tasks in each section.
 * @param {int} taskNumID - This is the ID of the element of each tasks section.
 */
function countTo(num, taskNumID) {
  let from = 0;
  let to = num;
  let step = to > from ? 1 : -1;
  let interval = 200;

  if (from == to) {
    document.getElementById(taskNumID).innerHTML = from;
    return;
  }

  let counter = setInterval(function () {
    from += step;
    document.getElementById(taskNumID).innerHTML = from;

    if (from == to) {
      clearInterval(counter);
    }
  }, interval);
}

/**
 * This function is used to check the length of all tasks from the board and call the function countTo.
 */
function loadTasksInSummary(area, tasksInArea) {
  let tasks;
  if (tasksInArea != 'tasks-in-board') {
    tasks = allTasks.filter((t) => t["area"] == area);
  }else{
    tasks = allTasks.filter(t => t.hasOwnProperty("area"));
  }
  
  if (tasks.length) {
    countTo(tasks.length, tasksInArea);
  }
}


/**
 * This function is used to filter the length of 'allTasks' with the 'urgent' priority and call the function countTo. It's also used to sort the urgent priority tasks and sort them from the clostest to the furthest date, by difference from today's date.
 */
function loadTaskUpcomingDeadline() {
  let prio;
  let tasksDate = [];

  prio = allTasks.filter((t) => t["prio"] == "urgent");
  countTo(prio.length, 'tasks-priority');
  if (prio.length) {
    for (let i = 0; i < prio.length; i++) {
      const taskDate = prio[i]['date'];
      tasksDate.push(taskDate);
    }

    // Sort array by difference from today's date
    let sortedDates = sortArrayByDifference(tasksDate);
    mostUrgentTask(sortedDates);
  }

}

/**
 * Sorts an array of task dates by their difference from the current date,
    in ascending order.
 * @param {Array} tasksDate - An array of task dates in the format YYYY-MM-DD.
    @returns {Array} - The sorted array of task dates.
 */
function sortArrayByDifference(tasksDate) {
  return tasksDate.sort(function (a, b) {
    return dateDifference(a) - dateDifference(b);
  });
}


/**
 * Displays the most urgent task date on the webpage.
 * @param {Array} sortedDates - An array of task dates in the format YYYY-MM-DD, sorted in ascending order of their difference from the current date.
 */
function mostUrgentTask(sortedDates) {
  sortedDatesConverted = sortedDates[0].split(/-/gi);
  document.getElementById('tasks-date').innerHTML = convertNumberInMonth(sortedDatesConverted[1] - 1) + ' ' + sortedDatesConverted[2] + ', ' + sortedDatesConverted[0];
}


/**
 * This function is used to returning the difference of the urgent task's date to the date today.
 * @param {int} date - Date from a urgent task.
 * @returns - Returns the difference of the urgent task's date to the date today.
 */
function dateDifference(date) {
  let difference = Math.abs(new Date(date) - today);
  return difference;
}

/**
 * This function is used to convert the month's from a number to month's name.
 * @param {int} sortedDatesMonth - Sorted months from the urgend task dates from 0 (January) to 11 (Dezember).
 * @returns - Returns the month's name.
 */
function convertNumberInMonth(sortedDatesMonth) {
  switch (parseInt(sortedDatesMonth)) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
  }
}

/**
 * This function is used to switch to the board site.
 */
function switchToBoard() {
  setTimeout(() => {
    window.location.href = "../html/board.html";
  }, 200);
}