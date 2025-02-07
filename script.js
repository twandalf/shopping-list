const itemForm = document.getElementById("item-form"); // dit is het invulvak, de form
const itemInput = document.getElementById("item-input"); // dit is wat erin zit, de value ervan
const itemList = document.getElementById("item-list"); // dit is de UL

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //   Validate input
  if (newItem === "") {
    alert("Please write something");
    return;
  }

  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
  itemInput.value = "";
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

// Event listener
itemForm.addEventListener("submit", addItem);
