const title = document.getElementById("title");
const image = document.querySelector("#productImage");
const input = document.getElementById("productName");
const list = document.getElementById("productList");
const message = document.getElementById("message");
const themeBtn = document.getElementById("themeBtn");

// 1. Theme Switcher Event
themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.innerHTML = isDark 
    ? '<i class="fa-solid fa-sun"></i> Light Theme' 
    : '<i class="fa-solid fa-moon"></i> Dark Theme';
});

// 2. Image Hover Effects
image.addEventListener("mouseover", function() {
  image.style.width = "320px";
});

image.addEventListener("mouseout", function() {
  image.style.width = "250px";
});

// 3. Typing Status Indicators
input.addEventListener("keyup", function() {
  if (input.value.trim() === "") {
    message.innerHTML = "";
  } else {
    message.innerHTML = "Typing: <strong>" + input.value + "</strong>";
  }
});

input.addEventListener("change", function() {
  message.innerHTML = "Input Changed";
});

// 4. Double Click Title Effect
title.addEventListener("dblclick", function() {
  title.style.color = title.style.color === "red" ? "" : "red";
});

// 5. Add Product Functionality
document.getElementById("addBtn").onclick = function() {
  const val = input.value.trim();
  if (val === "") {
    alert("Please enter a product name first!");
    return;
  }

  let item = document.createElement("li");
  item.innerHTML = `${val} <button class="delete-item-btn" onclick="removeItem(this)"><i class="fa-solid fa-xmark"></i></button>`;
  
  list.appendChild(item);
  input.value = "";
  message.innerHTML = "Product added successfully!";
};

// 6. Remove Last Product Functionality
document.getElementById("removeBtn").onclick = function() {
  if (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
    message.innerHTML = "Last product removed!";
  } else {
    message.innerHTML = "No items left to remove!";
  }
};

// 7. Remove Specific Individual Product (New Feature)
function removeItem(btnElement) {
  const li = btnElement.parentElement;
  li.remove();
  message.innerHTML = "Product deleted!";
}