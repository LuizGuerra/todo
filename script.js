const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Parse URL parameters
function parseUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

// Construct local storage key based on URL parameters
function constructLocalStorageKey() {
  const params = parseUrlParams();

  // Use a default key if no parameters are provided
  if (!params || Object.keys(params).length === 0) {
    return 'tasks'; // Default key
  }

  // Construct key based on parameters
  let key = 'tasks_';
  for (const [paramKey, paramValue] of Object.entries(params)) {
    key += `${paramKey}_${paramValue}_`;
  }
  return key.slice(0, -1); // Remove the trailing underscore
}


function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText !== '') {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', updateTasks);

    const label = document.createElement('label');
    label.textContent = todoText;
    label.classList.add('task');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete');
    deleteButton.onclick = function () {
      li.remove();
      saveTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteButton);
    todoList.insertBefore(li, todoList.firstChild);
    saveTasks();
    todoInput.value = '';
  } else {
    alert('Please enter a task!');
  }
}

function updateTasks() {
  saveTasks();
  const undoneTasks = [];
  const doneTasks = [];

  const lis = todoList.querySelectorAll('li');
  lis.forEach(li => {
    if (li.querySelector('input').checked) {
      doneTasks.push(li);
    } else {
      undoneTasks.push(li);
    }
  });

  todoList.innerHTML = '';
  undoneTasks.forEach(li => todoList.appendChild(li));
  doneTasks.forEach(li => todoList.appendChild(li));
}

function saveTasks() {
  const tasks = [];
  const lis = todoList.querySelectorAll('li');
  lis.forEach(li => {
    const task = {
      text: li.querySelector('label').textContent,
      done: li.querySelector('input').checked
    };
    tasks.push(task);
  });
  localStorage.setItem(constructLocalStorageKey(), JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(constructLocalStorageKey())) || [];

  // Sort tasks by completion status
  tasks.sort((a, b) => {
    if (a.done && !b.done) {
      return 1;
    } else if (!a.done && b.done) {
      return -1;
    } else {
      return 0;
    }
  });

  tasks.forEach(task => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', updateTasks);

    const label = document.createElement('label');
    label.textContent = task.text;
    label.classList.add('task');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete');
    deleteButton.onclick = function () {
      li.remove();
      saveTasks();
    };

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

loadTasks();

// Listen for Enter key press on the input field
todoInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addTodo();
  }
});




// document.getElementById('parameterForm').addEventListener('submit', function (event) {
//   event.preventDefault(); // Prevent form submission

//   const inputValue = document.getElementById('paramInput').value.trim().toLowerCase;
//   const baseUrl = window.location.href.split('?')[0]; // Get the base URL without parameters

//   if (inputValue) {
//     const newUrl = `${baseUrl}?key=${encodeURIComponent(inputValue)}`.toLowerCase();
//     window.location.href = newUrl; // Redirect to the new URL with the parameter
//   } else {
//     window.location.href = baseUrl;
//   }
// });
const urlList = document.getElementById('urlList');

// Load URLs from localStorage on page load
loadUrlsFromLocalStorage();

// Add event listener to the form
document.getElementById('parameterForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  const inputValue = document.getElementById('paramInput').value.trim().toLowerCase();
  const baseUrl = window.location.href.split('?')[0]; // Get the base URL without parameters

  if (inputValue) {
    const newUrl = `${baseUrl}?key=${encodeURIComponent(inputValue)}`;
    if (canAddNewRoute(inputValue)) {
      saveUrlToLocalStorage(newUrl); // Save the new URL to local storage
      addUrlToList(newUrl, capitalize(inputValue)); // Add the new URL to the list
    }
    window.location.href = newUrl;
  } else {
    window.location.href = baseUrl;
  }
});

// Function to load URLs from localStorage
function loadUrlsFromLocalStorage() {
  const urls = JSON.parse(localStorage.getItem('visitedUrls')) || [];
  urls.forEach(url => {
    const params = (new URL(url)).searchParams;
    const paramValue = params.get('key');
    addUrlToList(url, capitalize(paramValue));
  });
}

function capitalize(s) {
  return `${s.charAt(0).toUpperCase()}${s.substring(1)}`
}

// Function to save URL to localStorage
function saveUrlToLocalStorage(url) {
  const urls = JSON.parse(localStorage.getItem('visitedUrls')) || [];
  urls.push(url);
  localStorage.setItem('visitedUrls', JSON.stringify(urls));
}

// Function to add URL to the list
function addUrlToList(url, paramValue) {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.href = url;
  link.textContent = paramValue;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.className += 'delete'
  deleteButton.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the click event from triggering on the parent li
    li.remove();
    removeUrlFromLocalStorage(url);
  });

  li.appendChild(link);
  li.appendChild(deleteButton);

  li.addEventListener('click', function () {
    // Redirect to the URL when the list item is clicked
    window.location.href = url;
  });

  urlList.appendChild(li);
}


// Function to remove URL from localStorage
function removeUrlFromLocalStorage(url) {
  const urls = JSON.parse(localStorage.getItem('visitedUrls')) || [];
  const index = urls.indexOf(url);
  if (index !== -1) {
    urls.splice(index, 1);
    localStorage.setItem('visitedUrls', JSON.stringify(urls));
  }
}

function canAddNewRoute(s) {
  const anchorElements = document.querySelectorAll('#urlList li a');
  const texts = [];

  anchorElements.forEach(function (anchor) {
    texts.push(anchor.textContent.trim().toLowerCase());
  });

  return !texts.includes(s.toLowerCase());
}
