const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

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
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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

let draggedItem = null;
let dropZone = null;

// Add event listeners for drag events
todoList.addEventListener('dragstart', function(event) {
  draggedItem = event.target;
  event.dataTransfer.setData('text/plain', null); // Firefox requires data to be set for the drag to work
});

todoList.addEventListener('dragover', function(event) {
  event.preventDefault();
  const target = event.target;
  if (target.tagName === 'LI') {
    // Check if the target is different from the dragged item
    if (target !== draggedItem) {
      dropZone = target;
      target.style.backgroundColor = '#c9e4ff'; // Highlight the drop zone
    }
  }
});

todoList.addEventListener('dragleave', function(event) {
  const target = event.target;
  if (target.tagName === 'LI') {
    // Restore the original background color
    target.style.backgroundColor = '';
  }
});

todoList.addEventListener('drop', function(event) {
  event.preventDefault();
  if (dropZone) {
    // Ensure dropped item is not dropped onto itself
    if (draggedItem !== dropZone) {
      // Reorder the list items
      const droppedIndex = Array.from(todoList.children).indexOf(dropZone);
      const draggedIndex = Array.from(todoList.children).indexOf(draggedItem);
      if (draggedIndex < droppedIndex) {
        todoList.insertBefore(draggedItem, dropZone.nextSibling);
      } else {
        todoList.insertBefore(draggedItem, dropZone);
      }
    }
    dropZone.style.backgroundColor = ''; // Reset the background color
  } else {
    todoList.appendChild(draggedItem); // Append dragged item to the end if dropped outside the list
  }
  draggedItem = null;
  dropZone = null;
});
