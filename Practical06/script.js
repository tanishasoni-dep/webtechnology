// State & DOM Selectors
let packagesData = [];
const packagesContainer = document.getElementById("packagesContainer");
const categoryFilter = document.getElementById("categoryFilter");
const fetchBtn = document.getElementById("fetchPackagesBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorMessage = document.getElementById("errorMessage");
const themeToggle = document.getElementById("themeToggle");
const savedList = document.getElementById("savedList");

// 1. Storage: Load Preferences on Page Startup
document.addEventListener("DOMContentLoaded", () => {
  // LocalStorage: Load saved Theme preference
  if (localStorage.getItem("wandergo_theme") === "dark") {
    document.body.classList.add("dark");
  }

  // SessionStorage: Store/Retrieve Session Timestamp
  if (!sessionStorage.getItem("wandergo_session_start")) {
    sessionStorage.setItem("wandergo_session_start", new Date().toLocaleTimeString());
  }
  document.getElementById("sessionStatus").innerText = 
    `Session Started: ${sessionStorage.getItem("wandergo_session_start")}`;

  // LocalStorage: Load saved bookmarks
  renderSavedBookmarks();

  // Initial Fetch using Callback Pattern
  executeTaskWithCallback(fetchPackages);

  // Initialize Timers
  initPromotionalTimer();
});

// 2. Timers: Rotating Offers with setInterval & setTimeout
function initPromotionalTimer() {
  const promoOffers = [
    "Flash Deal: Get 20% OFF on Manali Packages!",
    "Weekend Special: Free Breakfast in Goa Resorts!",
    "Heritage Tour Special: Flat ₹2,000 off on Jaipur!"
  ];
  let index = 0;
  let seconds = 10;

  const promoText = document.getElementById("promoText");
  const countdownEl = document.getElementById("timerCountdown");

  // Rotating offer text every 10 seconds
  setInterval(() => {
    index = (index + 1) % promoOffers.length;
    promoText.innerText = promoOffers[index];
    seconds = 10;
  }, 10000);

  // Countdown timer update every second
  setInterval(() => {
    seconds--;
    if (seconds < 1) seconds = 10;
    countdownEl.innerText = `${seconds}s`;
  }, 1000);
}

// 3. Asynchronous Callback Pattern Demonstration
function executeTaskWithCallback(callback) {
  console.log("Executing preliminary async task setup...");
  setTimeout(() => {
    callback(); // Trigger the main fetch operation via callback
  }, 300);
}

// 4. Fetch API: Retrieve Packages from JSON
async function fetchPackages() {
  loadingSpinner.classList.remove("hidden");
  errorMessage.innerText = "";
  packagesContainer.innerHTML = "";

  try {
    // Fetch API call with async/await
    const response = await fetch("destinations.json");
    
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    packagesData = await response.json();
    displayPackages(packagesData);

  } catch (error) {
    console.error("Fetch Error:", error);
    errorMessage.innerText = "Failed to load travel packages. Make sure destinations.json exists or check live server.";
  } finally {
    loadingSpinner.classList.add("hidden");
  }
}

// 5. Dynamic DOM Rendering
function displayPackages(items) {
  packagesContainer.innerHTML = "";

  if (items.length === 0) {
    packagesContainer.innerHTML = `<p class="empty-msg">No packages match the selected criteria.</p>`;
    return;
  }

  items.forEach(pkg => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${pkg.image}" alt="${pkg.name}">
      <div class="card-body">
        <h3 class="card-title">${pkg.name}</h3>
        <p class="card-meta"><i class="fa-solid fa-clock"></i> ${pkg.duration} | <strong>${pkg.category}</strong></p>
        <div class="card-price">
          <span>${pkg.price}</span>
          <button class="bookmark-btn" onclick="toggleBookmark(${pkg.id}, '${pkg.name}')" title="Save Package">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
      </div>
    `;
    packagesContainer.appendChild(card);
  });
}

// Filter Event
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  if (selected === "All") {
    displayPackages(packagesData);
  } else {
    const filtered = packagesData.filter(item => item.category === selected);
    displayPackages(filtered);
  }
});

// Manual Reload Event
fetchBtn.addEventListener("click", fetchPackages);

// Theme Toggle with LocalStorage
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("wandergo_theme", isDark ? "dark" : "light");
});

// 6. Browser Storage: Manage Bookmarks in LocalStorage
function toggleBookmark(id, name) {
  let bookmarks = JSON.parse(localStorage.getItem("wandergo_saved")) || [];
  
  if (!bookmarks.some(item => item.id === id)) {
    bookmarks.push({ id, name });
    localStorage.setItem("wandergo_saved", JSON.stringify(bookmarks));
    renderSavedBookmarks();
  }
}

function removeBookmark(id) {
  let bookmarks = JSON.parse(localStorage.getItem("wandergo_saved")) || [];
  bookmarks = bookmarks.filter(item => item.id !== id);
  localStorage.setItem("wandergo_saved", JSON.stringify(bookmarks));
  renderSavedBookmarks();
}

function renderSavedBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem("wandergo_saved")) || [];
  savedList.innerHTML = "";

  if (bookmarks.length === 0) {
    savedList.innerHTML = `<li class="empty-msg">No saved packages yet. Click the heart icon on any deal!</li>`;
    return;
  }

  bookmarks.forEach(item => {
    const tag = document.createElement("li");
    tag.className = "saved-tag";
    tag.innerHTML = `
      ${item.name}
      <i class="fa-solid fa-xmark" onclick="removeBookmark(${item.id})"></i>
    `;
    savedList.appendChild(tag);
  });
}