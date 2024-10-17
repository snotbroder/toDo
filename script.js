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
  const date = new Date();
  const time = date.toLocaleTimeString();
  console.log("--------NEW LINE--------", time);
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

  //   const date = new Date();
  //   const time = date.toLocaleTimeString();

  // set clone data
  clone.querySelector("[data-type=title] span").textContent = newTask.title;
  clone.querySelector("[data-type=quantity] span").textContent = newTask.quantity;
  clone.querySelector("[data-type=category] span").textContent = newTask.category;
  clone.querySelector("[data-type=uuid] span").textContent = newTask.uuid;
  //clone.querySelector("[data-type=time] span").textContent = `${date} at ${time}`;

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

  const card = clone.querySelector(".task-card");
  card.setAttribute("data-uuid", task.uuid);

  //clone.querySelector(".task-card").addEventListener("click", reAddTask);
  clone.querySelector(".task-card").addEventListener("click", () => userDecide(task));

  // Append to the deactivated task section
  document.querySelector("#deactivatedTask").appendChild(clone);
}

// Dialog where user should decide what to do when clicked on deactivated card
function userDecide(task) {
  const dialog = document.querySelector("dialog");
  const closeBtn = document.querySelector("#closeDialog");
  const reAddBtn = document.querySelector("#reAdd");

  //open dialog
  dialog.showModal();

  dialog.dataset.uuid = task.uuid;
  reAddBtn.addEventListener("click", () => {
    reAddTask(task);
  });

  closeBtn.addEventListener("click", () => {
    dialog.close();
  });
}

function reAddTask(task) {
  // Move the task back to the active list
  list.push(task);
  localStorage.setItem("taskList", JSON.stringify(list));

  // Remove the task from the deactivated list
  deactivatedList = deactivatedList.filter((t) => t.uuid !== task.uuid);
  localStorage.setItem("deactivatedList", JSON.stringify(deactivatedList));

  // Remove the card from the deactivated task section
  const card = document.querySelector(`[data-uuid="${task.uuid}"]`);
  if (card) card.remove();

  // Display the task in the active list
  displayTask(task);

  // Close the dialog
  document.querySelector("dialog").close();
}

// function reAddTask(event) {
//   const card = event.target.closest(".task-card");

//   if (!card) return; // Ignore clicks outside cards

//   // Extract task data from the card
//   const title = card.querySelector("[data-type=title] span").textContent;
//   const category = card.querySelector("[data-type=category] span").textContent;
//   const quantity = card.querySelector("[data-type=quantity] span").textContent;
//   const uuid = card.querySelector("[data-type=uuid] span").textContent;

//   // Create a task object and add it to the active list
//   const readdedTask = { title, category, quantity, uuid };
//   list.push(readdedTask);

//   // Save the updated lists to localStorage
//   localStorage.setItem("taskList", JSON.stringify(list));

//   // Remove the task from the deactivated list (memory and DOM)
//   deactivatedList = deactivatedList.filter((task) => task.uuid !== uuid);
//   localStorage.setItem("deactivatedList", JSON.stringify(deactivatedList));
//   card.remove(); // Remove the card from the deactivated list section

//   // Display the re-added task in the active list
//   displayTask(readdedTask);
// }
