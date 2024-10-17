"use strict";
document.querySelector("#create").addEventListener("click", createTask);

// Load tasks from localStorage when the page loads
let list = JSON.parse(localStorage.getItem("taskList")) || [];
let deactivatedList = JSON.parse(localStorage.getItem("deactivatedList")) || [];

// Display existing tasks on load
document.addEventListener("DOMContentLoaded", () => {
  list.forEach(displayTask);
  deactivatedList.forEach(displayDeactivatedTask);
});

//controlpanel reset activelist button
document.querySelector("#resetList").addEventListener("click", () => {
  //clear storage
  localStorage.removeItem("taskList");
  //clear array
  list = [];
  //update displayed tasks
  document.querySelector("#displayTask").innerHTML = "";

  console.log("cleared list and storage");
});
//controlpanel reset deactivated list button
document.querySelector("#resetDeactivatedList").addEventListener("click", () => {
  //clear storage
  localStorage.removeItem("deactivatedList");
  //clear array
  deactivatedList = [];
  //update displayed tasks
  document.querySelector("#deactivatedTask").innerHTML = "";

  console.log("cleared list and storage");
});

//controlpanel button print
document.querySelector("#printList").addEventListener("click", () => {
  console.log("active list:");
  console.table(list);
  console.log("deactivated list:");
  console.table(deactivatedList);
});

//create new task based on input
function createTask() {
  let title = document.querySelector("#createTitle").value;
  let category = document.querySelector("#createCategory").value;
  let quantity = document.querySelector("#createQuantity").value;

  let uuid = self.crypto.randomUUID();

  //if input are empty/undefined
  if (!title || !category || !quantity) {
    console.log("empty input");
    alert("Please input");
    return;
  }

  console.log(`task created: ${title}`);

  // Create a new task object and add it to the list
  const newTask = { title, category, quantity, uuid };
  list.push(newTask);

  // Save the updated list to localStorage
  localStorage.setItem("taskList", JSON.stringify(list));

  //display the task and send the object information with it
  displayTask(newTask);
  reset();
}

//reset input fields
function reset() {
  document.querySelector("#createTitle").value = "";
  document.querySelector("#createCategory").value = "";
  document.querySelector("#createQuantity").value = "";
}

function displayTask(newTask) {
  // create clone
  const clone = document.querySelector("template#tasks").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-type=title] span").textContent = newTask.title;
  clone.querySelector("[data-type=quantity] span").textContent = newTask.quantity;
  clone.querySelector("[data-type=category] span").textContent = newTask.category;
  clone.querySelector("[data-type=uuid] span").textContent = newTask.uuid;

  //make card clickable for deactivation
  clone.querySelector(".task-card").addEventListener("click", deactivate);

  // append clone to list
  document.querySelector("#displayTask").appendChild(clone);
}

//deactivated list
function deactivate(event) {
  const card = event.target.closest(".task-card");

  if (!card) return; // Ignore clicks outside cards

  // Extract task data from the card
  const title = card.querySelector("[data-type=title] span").textContent;
  const category = card.querySelector("[data-type=category] span").textContent;
  const quantity = card.querySelector("[data-type=quantity] span").textContent;
  const uuid = card.querySelector("[data-type=uuid] span").textContent;

  // Create a task object and move to the deactivated list
  const deactivatedTask = { title, category, quantity, uuid };
  deactivatedList.push(deactivatedTask);

  // Save deactivated list to localStorage
  localStorage.setItem("deactivatedList", JSON.stringify(deactivatedList));

  // Remove from the active list (both UI and memory)
  list = list.filter((task) => task.uuid !== uuid);
  localStorage.setItem("taskList", JSON.stringify(list));
  card.remove(); // Remove the card from the DOM

  // Display the task in the deactivated section
  displayDeactivatedTask(deactivatedTask);
}

// Display a task in the deactivated list
function displayDeactivatedTask(task) {
  const clone = document.querySelector("template#tasks").content.cloneNode(true);

  // Set task data
  clone.querySelector("[data-type=title] span").textContent = task.title;
  clone.querySelector("[data-type=category] span").textContent = task.category;
  clone.querySelector("[data-type=quantity] span").textContent = task.quantity;
  clone.querySelector("[data-type=uuid] span").textContent = task.uuid;

  clone.querySelector(".task-card").addEventListener("click", reAddTask);

  // Append to the deactivated task section
  document.querySelector("#deactivatedTask").appendChild(clone);
}

function reAddTask(event) {
  const card = event.target.closest(".task-card");

  if (!card) return; // Ignore clicks outside cards

  // Extract task data from the card
  const title = card.querySelector("[data-type=title] span").textContent;
  const category = card.querySelector("[data-type=category] span").textContent;
  const quantity = card.querySelector("[data-type=quantity] span").textContent;
  const uuid = card.querySelector("[data-type=uuid] span").textContent;

  // Create a task object and add it to the active list
  const readdedTask = { title, category, quantity, uuid };
  list.push(readdedTask);

  // Save the updated lists to localStorage
  localStorage.setItem("taskList", JSON.stringify(list));

  // Remove the task from the deactivated list (memory and DOM)
  deactivatedList = deactivatedList.filter((task) => task.uuid !== uuid);
  localStorage.setItem("deactivatedList", JSON.stringify(deactivatedList));
  card.remove(); // Remove the card from the deactivated list section

  // Display the re-added task in the active list
  displayTask(readdedTask);
}
