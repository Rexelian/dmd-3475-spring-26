//global variables
var taskList = [];
var archive = [];
var listElement = document.querySelector('#taskList');
var taskButton = document.querySelector("#addTask");
var taskInput = document.querySelector("#newTask");
var createButton = document.querySelector("#createTask");
var writeTask = document.querySelector("#taskWriter");
var subBtn = document.querySelector("#submit");

//global functions
function addTask(task) {
    taskList.push(task);
}

function saveTasks() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
  localStorage.setItem("archive", JSON.stringify(archive));
}

function loadTasks() {
  taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  archive = JSON.parse(localStorage.getItem("archive")) || [];
}

function renderList() {
  var listElement = document.querySelector('#taskList');
  listElement.innerHTML = '';

  for (var i = 0; i < taskList.length; i++) {
    var li = document.createElement("li");
    li.classList.add("task");

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("completed");

    // Add/remove class when checked
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        this.closest("li").classList.add("checked-task");
      } else {
        this.closest("li").classList.remove("checked-task");
      }
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(taskList[i]));

    listElement.appendChild(li);
  }

  updateCounts();
}

    //I want to make a function that moves completed tasks to a different list here

function moveCheckedTasksToArchive() {
  const checkedTasks = document.querySelectorAll(".task.checked-task");

  checkedTasks.forEach(taskEl => {
    const taskText = taskEl.childNodes[1].textContent.trim();


    archive.push(taskText);

    const index = taskList.indexOf(taskText);
    if (index !== -1) {
      taskList.splice(index, 1);
    }
  });

  saveTasks();
  renderList();
  updateCounts();
}

function clearAllTasks() {
  if (!confirm("Are you sure you want to delete ALL tasks and archive items?")) {
    return;
  }

  taskList = [];
  archive = [];
  saveTasks();
  renderList();
}

function updateCounts() {
  document.getElementById("taskCount").textContent = taskList.length;
  document.getElementById("archiveCount").textContent = archive.length;
}


//event listeners
createButton.addEventListener("click", function() {
    writeTask.classList.toggle("visible");
})

taskButton.addEventListener("click", function() {
    var taskText = taskInput.value;
            
    if (taskText.trim() === "") {
        alert("Please enter a task");

    } else {
        addTask(taskText);
        console.log(taskList);
        renderList();
        updateCounts();
    }
           
})


subBtn.addEventListener("click", moveCheckedTasksToArchive);

document.querySelector("#clearAll").addEventListener("click", clearAllTasks);

//outputs
addTask("Go to lunch");
addTask("Forget about functions");

window.onload(renderList());
console.log(taskList);