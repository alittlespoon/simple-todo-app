// get DOM elements
const todoForm = document.querySelector("#todo-form");
const taskList = document.querySelector(".task-list");
const remainingTasks = document.querySelector(".tasks-remaining");
const taskInput = document.querySelector("#todo-form input");
const clearCompletedTasks = document.querySelector(".clear-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// if there are items in local storage
// call addTask() on each item in local storage
if (localStorage.getItem("tasks")) {
  tasks.map((task) => addTask(task));
}

// update local storage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// submit event
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // store input value in variable
  const inputValue = taskInput.value;

  // return if input value is empty or null
  if (inputValue === "" || inputValue == null) return;

  // create task object
  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  // remove value from input
  taskInput.value = null;

  // push new task into tasks array
  tasks.push(task);

  // save tasks in local storage
  updateLocalStorage();

  addTask(task);
});

// click event on task item
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task")) {
    const taskId = e.target.closest("li").id;

    deleteTask(taskId);
  }
});

taskList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();

    // exit edit mode
    e.target.blur();
  }
});

taskList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;

  updateTask(taskId, e.target);
});

// add task
function addTask(task) {
  // create <li> element
  const taskElement = document.createElement("li");

  // set id attribute
  taskElement.setAttribute("id", task.id);

  // set complete class if task is complete
  if (task.isCompleted) {
    taskElement.classList.add("complete");
  }

  const taskElementMarkup = `
    <div>
        <input type="checkbox" name="tasks" id="${task.id}"
        ${task.isCompleted ? "checked" : ""}>
        <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    </div>

    <button 
        title="Delete task" 
        class="delete-task material-symbols-rounded"
    >Close
    </button>
  `;

  taskElement.innerHTML = taskElementMarkup;
  taskList.appendChild(taskElement);

  countTasks();
}

// count remaining tasks
function countTasks() {
  const incompleteTaskCount = tasks.filter((task) => !task.isCompleted).length;

  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  remainingTasks.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

// delete task
function deleteTask(taskId) {
  // remove task from tasks array
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  // remove item from markup
  document.getElementById(taskId).remove();

  // update local storage
  // recount tasks
  updateLocalStorage();
  countTasks();
}

// update task
function updateTask(taskId, element) {
  // target task item
  const task = tasks.find((task) => task.id === parseInt(taskId));

  // check if e.target is <span> element or checkbox
  if (element.hasAttribute("contenteditable")) {
    task.name = element.textContent;
  } else {
    const span = element.nextElementSibling;
    const parent = element.closest("li");

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", "true");
      parent.classList.remove("complete");
    }
  }

  // update local storage
  // recount tasks
  updateLocalStorage();
  countTasks();
}

// clear completed tasks
clearCompletedTasks.addEventListener("click", (e) => {
  const completedTasks = tasks.filter((task) => task.isCompleted);

  completedTasks.map((task) => deleteTask(task.id));
});
