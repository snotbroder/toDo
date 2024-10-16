"use strict";
document.querySelector("#create").addEventListener("click", createTask);

// Load tasks from localStorage when the page loads
let list = JSON.parse(localStorage.getItem("taskList")) || [];

// Display existing tasks on load
list.forEach((task) => displayTask(task.title, task.category, task.quantity, task.uuid));

//Make all task cards clickable
document.querySelectorAll(".task-card").forEach((button) => button.addEventListener("click", deactivate));

// Put card in deactivated list
function deactivate(event) {
  let card = event.target;

  console.log("card: ", card);
}

//clear list button
document.querySelector("#resetList").addEventListener("click", () => {
  //clear storage
  localStorage.removeItem("taskList");
  //clear array
  list = [];
  //update displayed tasks
  document.querySelector("#displayTask").innerHTML = "";

  console.log("cleared list and storage");
});

//print list button
document.querySelector("#printList").addEventListener("click", () => {
  console.table(list);
});

let input = document.querySelectorAll("input");

function createTask() {
  let title = document.querySelector("#createTitle").value;
  let category = document.querySelector("#createCategory").value;
  let quantity = document.querySelector("#createQuantity").value;

  let uuid = self.crypto.randomUUID();

  if (!title || !category || !quantity) {
    console.log("empty input");
    alert("Please input");
    return;
  }
  displayTask(title, category, quantity, uuid);
  console.log(`task created: ${title}`);

  // Create a new task object and add it to the list
  const newTask = { title, category, quantity, uuid };
  list.push(newTask);

  // Save the updated list to localStorage
  localStorage.setItem("taskList", JSON.stringify(list));

  reset();
}

function reset() {
  document.querySelector("#createTitle").value = "";
  document.querySelector("#createCategory").value = "";
  document.querySelector("#createQuantity").value = "";
}

function displayTask(title, category, quantity, uuid) {
  // create clone
  const clone = document.querySelector("template#tasks").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-type=title] span").textContent = title;
  clone.querySelector("[data-type=quantity] span").textContent = quantity;
  clone.querySelector("[data-type=category] span").textContent = category;
  clone.querySelector("[data-type=uuid] span").textContent = uuid;

  // append clone to list
  document.querySelector("#displayTask").appendChild(clone);
}
