# Join
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
