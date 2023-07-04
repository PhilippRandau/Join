# Join
Join is a feature-rich project management tool that combines the power of drag and drop task management with the intuitive Kanban system, allowing users to effortlessly create, organize, and track tasks. With seamless task movement and efficient contact management, Join enhances collaboration and streamlines project workflows.

### [Test here](https://philipp-randau.developerakademie.net/Join/index.html)

### Some info for me
--Mini-Backend--
https://github.com/JunusErgin/smallest_backend_ever

Live server & Allow CORS nicht vergessen zu aktivieren!!


-VORSICHT--DATEN VOM BACKENDLÖSCHEN-
deleteUser('users')
async function deleteUser() {
  await backend.deleteItem('users', currentUser);
}

deleteUser('allTasks')
async function deleteUser() {
  await backend.deleteItem('allTasks');
}

<!--Beispiel um contacts eines bestimmten user's (id = 2) zu löschen-->
<!--deleteUser('user"die Id des jeweiligen CurrentUser"Contacts')-->
deleteUser('userID2Contacts')

async function deleteUser() {
  await backend.deleteItem('userID2Contacts');
}
