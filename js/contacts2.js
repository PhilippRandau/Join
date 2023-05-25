/**
 * Attempts to get the email from the "email" input field and, if empty, uses the email from the "editEmail" input field.
 * @returns {string} - The retrieved email.
 */
function tryGetEmail() {
    let newEmail = document.getElementById("email").value.toLowerCase();
    addContactEmail(newEmail);
    if (newEmail === "") {
      let nameEdit = document.getElementById("editEmail").value.toLowerCase();
      addContactEmail(nameEdit);
      return nameEdit;
    } else {
      return newEmail;
    }
  }
  
  
  /**
   * Adds a new email to a contact's information.
   * @param {string} email - The new email to add.
   * @returns {string|undefined} - The new email added to the contact's information, or undefined if the email is invalid.
   */
  function addContactEmail(email) {
    let newEmail = email;
    let emailRegex = getEmailRegEx(newEmail);
    if (!emailRegex.test(newEmail)) {
      return;
    } else {
      return newEmail;
    }
  }
  
  
  /**
   * Attempts to get the phone number from the "phone" input field and, if empty or equal to the edited phone number, uses the phone number from the "editPhone" input field.
   * @returns {string} - The retrieved phone number.
   */
  function tryGetPhone() {
    let newPhone = document.getElementById("phone").value;
    let newNumber = setPhoneNumber(newPhone);
    if (newPhone === "" || newNumber == newPhone) {
      let phoneEdit = document.getElementById("editPhone").value;
      let editNumber = setPhoneNumber(phoneEdit);
      if (editNumber === "") {
        let x = document.getElementById("falseEditPhone")
        x.classList.remove("d-none")
      }
      return editNumber;
    }
    if (newPhone.length < 4) {
      return false;
    } else {
      return newNumber;
    }
  }
  
  
  /**
   * Formats the phone number by removing any non-numeric characters and adding a space after the fourth digit.
   * @param {string} numberInput - The phone number input string.
   * @returns {string} The formatted phone number string.
   */
  function setPhoneNumber(numberInput) {
    let phoneNumber = numberInput.replace(/\D/g, "");
    phoneNumber = `${phoneNumber}`;
    phoneNumber = phoneNumber.replace(/(\d{4})(\d{1})/, "$1 $2");
    return phoneNumber;
  }
  
  
  /**
   * Attempts to get the name from the "name" input field and, if empty or already in title case, uses the name from the "editName" input field.
   * @returns {string} - The retrieved name.
   */
  function tryGetName() {
    let name = document.getElementById("name").value.toLowerCase();
    let newName = addContactName(name);
    if (name === "" || newName === name) {
      let nameEdit = document.getElementById("editName").value.toLowerCase();
      let editName = addContactName(nameEdit);
      return editName;
    } else {
      return newName;
    }
  }
  
  
  /**
   * Formats the name string by capitalizing the first letter of each word.
   * @param {string} name - The name string.
   * @returns {string} The formatted name string in title case.
   */
  function addContactName(name) {
    let newName = name.replace(/\b\w/g, (l) => l.toUpperCase());
    return newName;
  }
  
  
  /**
   * Validates the "editName" input field value to ensure it contains only alphabets and spaces, and each word starts with a capital letter.
   * @returns {boolean} Whether the "editName" input field value is valid or not.
   */
  function proofEditName() {
    let regName = /^[\wäöüÄÖÜ]+(?: [\wäöüÄÖÜ]+)+$/;
    let name = document.getElementById("editName").value;
    if (!regName.test(name)) {
      document.getElementById("editName").focus();
      document.getElementById("editName").classList.add("falseInput");
      document.getElementById("falseEditName").classList.remove("d-none")
      return false;
    } else {
      document.getElementById("editName").classList.remove("falseInput");
      document.getElementById("falseEditName").classList.add("d-none")
      return true;
    }
  }
  
  
  /**
   * Validates the "editEmail" input field value to ensure it is a valid email address.
   * @returns {boolean} Whether the "editEmail" input field value is a valid email address or not.
   */
  function proofEditEmail() {
    let regEmail = getEmailRegEx();
    let email = document.getElementById("editEmail").value;
    if (!regEmail.test(email)) {
      document.getElementById("editEmail").focus();
      document.getElementById("editEmail").classList.add("falseInput");
      document.getElementById("falseEditEmail").classList.remove("d-none")
      return false;
    } else {
      document.getElementById("falseEditEmail").classList.add("d-none")
      document.getElementById("editEmail").classList.remove("falseInput");
      return true;
    }
  }
  
  
  /**
   * Validates the input value of a phone number input field.
   * @param {string} id - The ID of the phone number input field.
   * @returns {boolean} Whether the input value is valid (i.e., contains between 5 and 15 numbers).
   */
  function proofPhone(id) {
    const phoneInput = document.getElementById(id);
    const phoneError = document.getElementById("phoneError");
    if (phoneInput.value.length < 5) {
      setMinTextForInput(id, phoneError)
      return false;
    } else if (phoneInput.value.length > 14) {
      setMaxTextForInput(id, phoneError)
      return false;
    } else {
      setNoneTextForInput(id, phoneError)
      return true;
    }
  }
  
  
  /**
   * Sets an error message and highlights the input field if the phone number input is too short
   * @param {string} id - The ID of the phone number input field
   * @param {HTMLElement} phoneError - The HTML element where the error message should be displayed
   */
  function setMinTextForInput(id, phoneError) {
    document.getElementById(id).focus();
    document.getElementById(id).classList.add("falseInput");
    phoneError.innerText = "Phone number min 5 Numbers";
  }
  
  
  /**
   * Sets an error message and highlights the input field if the phone number input is too long
   * @param {string} id - The ID of the phone number input field
   * @param {HTMLElement} phoneError - The HTML element where the error message should be displayed
   */
  function setMaxTextForInput(id, phoneError) {
    document.getElementById(id).focus();
    document.getElementById(id).classList.add("falseInput");
    phoneError.innerText = "Phone number max 15 Numbers";
  }
  
  
  /**
   * Removes the error text and styling from an input field.
   * @param {string} id - The ID of the input field.
   * @param {HTMLElement} phoneError - The error message element.
   */
  function setNoneTextForInput(id, phoneError) {
    phoneError.innerText = "";
    document.getElementById(id).classList.remove("falseInput");
  }
  
  
  /**
   * Clears the input fields for name, email, and phone number, and closes the add contact modal
   */
  function clearContactsInputs() {
    let name = document.getElementById("name");
    name.value = "";
    let email = document.getElementById("email");
    email.value = "";
    let phone = document.getElementById("phone");
    phone.value = "";
    closeAddNewContact()
  }
  
  
  // Responsive //
  /**
   * Hides the right section of the page when the media query matches a max-width of 1000px
   */
  function backToContacts() {
    let rightContactContainer = document.getElementById('rightSectionCO')
    rightContactContainer.classList.add('d-none')
  }
  
  
  /**
   * Toggles the visibility of certain elements on the page depending on whether the media query matches
   * @param {MediaQueryListEvent} x - The media query list event that fired
   */
  function myFunction(x) {
    let textPosi = document.getElementById('textPosi')
    let textPosiRE = document.getElementById('textPosiRE')
    let sectionHidden = document.getElementById('rightSectionCO')
    if (x.matches) { // If media query matches
      textPosi.classList.add('d-none')
      textPosiRE.classList.remove('d-none')
      sectionHidden.classList.add('d-none')
    } else {
      textPosi.classList.remove('d-none')
      textPosiRE.classList.add('d-none')
      sectionHidden.classList.remove('d-none')
    }
  }
  
  
  /**
   * Sets a function to be executed after a specified amount of time has elapsed.
   * @param {Function} fn - The function to be executed.
   * @param {number} delay - The time to wait before executing the function, in milliseconds.
   * @returns {number} - The numeric ID of the timeout, which can be used with `clearTimeout()`.
   */
  setTimeout(() => {
    let x = window.matchMedia("(max-width: 1000px)")
    myFunction(x) // Call listener function at run time
    x.addListener(myFunction) // Attach listener function on state changes
  }, 100);