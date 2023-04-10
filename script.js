const toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

// call the displayToDoList function when the page loads
window.onload = () => displayToDoList();

function toDo(title, description, status = 'Incomplete', key) {
  this.title = title;
  this.description = description;
  this.status = status;
  this.key = key;
}

function generateUUID() {
  const timestamp = Date.now();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (timestamp + Math.random() * 16) % 16 | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  uuid = uuid.toLowerCase();
  uuid = uuid.replace(/^./, function(firstChar) {
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    return randomLetter + firstChar.substring(1);
  });
  return uuid;
}

function refreshList(callback) {
  displayToDoList();
  if (callback) {
    callback();
  }
}

function clearInputs() {
  document.getElementById('todo-title').value = '';
  document.getElementById('todo-description').value = '';
}

function saveUpdatedListToLocalStorage() {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function clearMessage() {
  const message = document.getElementById('message');
  message.innerText = '';
}

function updatedMessage() {
  const message = document.getElementById('message');
  message.innerText = 'To-do updated.';
  setTimeout(clearMessage, 3000);
}

function deletedMessage() {
  const message = document.getElementById('message');
  message.innerText = 'To-do deleted.';
  setTimeout(clearMessage, 3000);
}

function errorMessage () {
  const taskForm = document.querySelector('form');
  const message = document.getElementById('message');
  message.innerText = `No changes made. ${ taskForm.classList.contains('hidden') ? 'Update status of to-do(s)' : 'To-do title must be filled out so add new to-do'}`;
  setTimeout(clearMessage, 3000);
}

function makeNewToDo() {
  const titleInput = document.getElementById('todo-title');
  const descriptionInput = document.getElementById('todo-description');

  if (!titleInput.value) {
    errorMessage();
    return;
  }

  const newToDo = new toDo(
      titleInput.value,
      descriptionInput.value,
      'Incomplete',
      generateUUID() // generate a unique identifier
    );

  toDoList.push(newToDo);
  saveUpdatedListToLocalStorage();
  refreshList(() => updatedMessage());
  clearInputs();
  toggleHidden();
}

function setStatusOptions(toDoStatus) {
  const statusOptions = {
    Incomplete: ['Incomplete', 'In Progress', 'Completed'],
    'In Progress': ['In Progress', 'Completed', 'Incomplete'],
    Completed: ['Completed', 'Incomplete', 'In Progress']
  };

  const options = statusOptions[toDoStatus];

  return options.map(option => `
    <option value="${option}">
      ${option}
    </option>
  `).join('')
}

function displayToDoList() {
  const message = document.getElementById('message');
  const list = document.getElementById('list');

  if (toDoList.length > 0) {
    message.innerText = '';

    list.innerHTML = toDoList.map(toDo => `
      <li data-id="${toDo.key}">
        ${toDo.title}
        <ul>
          <li>${toDo.description}</li>
          <li>
            <select name="status" id="${toDo.key}-status" onchange="updateStatus('${toDo.key}')">
              ${setStatusOptions(toDo.status)}
            </select>
          </li>
          <li>
            <button onclick="remove('${toDo.key}')">delete</button>
          </li>
        </ul>
      </li>
    `).join('');
  } else {
    message.innerText = 'You have nothing on your to-do list. Click on "Add to-do" to add to your list.';
    list.innerHTML = '';
  }
}

function toggleHidden() {
  const hiddenItems = document.querySelectorAll('.hide-item');
  hiddenItems.forEach((item) => {
    item.classList.toggle('hidden');
  })
  togglerButton(hiddenItems);
}

function togglerButton(hiddenItems) {
  const formToggle = document.getElementById('form-toggler');
  let buttonText
  hiddenItems.forEach((item) => {
    buttonText = item.classList.contains('hidden') ? 'Add to-do' : 'Cancel';
  })
  formToggle.innerText = buttonText;
}

// Update to-do status on save
function updateStatus(keyId) {
  let success = false;
  const selectedStatus = document.querySelector(`#${keyId}-status`).value;
  const toDoItem = toDoList.find((toDoItem) => toDoItem.key = keyId)

  if (toDoItem.status !== selectedStatus) {
    toDoItem.status = selectedStatus;
    success = true;
  }

  if(success) {
    saveUpdatedListToLocalStorage();
    refreshList(() => updatedMessage());
  } else {
    errorMessage();}
}

function remove(keyId) {
  if (window.confirm('Do you really want to delete this to-do item?')) {
    const indexToRemove = toDoList.findIndex((toDoItem) => toDoItem.key === keyId);

    if (indexToRemove === -1) {
      return;
    }

    toDoList.splice(indexToRemove, 1);
    saveUpdatedListToLocalStorage();
    refreshList(() => deletedMessage());
  }
}