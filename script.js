const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    displayTasks(btn.dataset.filter);
  });
});

// Functions
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = { text: taskText, completed: false, id: Date.now() };
  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  displayTasks();
}

function displayTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('done');

    li.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      displayTasks(document.querySelector('.filters button.active').dataset.filter);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      displayTasks(document.querySelector('.filters button.active').dataset.filter);
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial Display
displayTasks();
