const itemForm = document.getElementById("item-form"); // dit is het invulvak, de form
const itemInput = document.getElementById("item-input"); // dit is wat erin zit, de value ervan
const itemList = document.getElementById("item-list"); // dit is de UL
const clearButton = document.getElementById("clear"); // dit is de clearknop
const itemFilter = document.getElementById("filter"); //het filtervak
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

// Naar DOM én naar Localstorage
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //   Validate input
  if (newItem === "") {
    alert("Please write something");
    return;
  }

  // Check of we in edit-mode zitten
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That item already exists");
      return;
    }
  }

  // Maak item in DOM
  addItemToDom(newItem);

  //Voeg item toe aan Localstorage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
}

function addItemToDom(item) {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Hier wordt li item toegevoegd aan DOM
  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  // Converteer naar JSON STRING(!) en steek de string in localstorage

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure?")) {
    //Verwijder li van DOM
    item.remove();

    // Verwijder van Localstorage
    removeItemFromLocalStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromLocalStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localstorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localstorage

  localStorage.removeItem("items");

  checkUI();
}

function filterItem(e) {
  const text = e.target.value.toLowerCase(); // de tekst zelf
  const items = itemList.querySelectorAll("li"); // de afz items (li's)

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function checkUI() {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li"); // de afzonderlijke items

  if (items.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }
  formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

// Initialize app
function init() {
  // Event listener
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItem);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
