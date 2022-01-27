const list = document.querySelector(".list");
const form = document.querySelector(".shopping");
let items = [];

function getInput(userInput) {
  const eachInput = userInput.target.item.value;

  const item = {
    name: eachInput,
    id: Date.now(),
    complete: false,
  };
  items.push(item);
  list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function clearForm(event) {
  event.target.reset();
}

function addToList() {
  const html = items
    .map(
      (item) => `
        <li class="shopping-item"> 
        <input value="${item.id}" type="checkbox" ${item.complete ? "checked" : ""}> 
        <span class="itemName"> ${item.name} </span>
        <button class="delete-button" value="${item.id}" aria-label="Remove ${item.name}">&times</button>
        </li>`
    )
    .join("");
  list.innerHTML = html;
}
function submitForm(event) {
  event.preventDefault();
  getInput(event);
  clearForm(event);
}

function copyToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function getLocalStorage() {
  const storageItems = JSON.parse(localStorage.getItem("items"));
  if (storageItems.length) {
    storageItems.forEach((item) => {
      items.push(item);
      list.dispatchEvent(new CustomEvent("itemsUpdated"));
    });
  }
}

function markAsComplete(event) {
  const id = parseInt(event.target.value);
  if (event.target.matches("input[type='checkbox']")) {
    const findItem = items.find((item) => item.id === id);
    findItem.complete = !findItem.complete;
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

function deleteOption(event) {
  const id = parseInt(event.target.value);
  if (event.target.matches("button")) {
    items = items.filter((item) => item.id !== id);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}

form.addEventListener("submit", submitForm);
list.addEventListener("itemsUpdated", addToList);
list.addEventListener("itemsUpdated", copyToLocalStorage);
list.addEventListener("click", deleteOption);
list.addEventListener("click", markAsComplete);

getLocalStorage();
