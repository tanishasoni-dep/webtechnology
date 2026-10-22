// DOM Element References
const form = document.getElementById("registrationForm");
const themeToggle = document.getElementById("themeToggle");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const dobInput = document.getElementById("dob");
const strengthBar = document.getElementById("strengthBar");
const summarySection = document.getElementById("summarySection");
const summaryContent = document.getElementById("summaryContent");

// RegEx Patterns
const patterns = {
  // Name: Only alphabets and spaces, 2 to 50 chars
  fullName: /^[A-Za-z\s]{2,50}$/,
  // Mobile: Exactly 10 digits starting with 6-9 (Indian standard)
  mobile: /^[6-9]\d{9}$/,
  // Standard Email RegEx
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/
};

// 1. Theme Switcher
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerHTML = isDark 
    ? '<i class="fa-solid fa-sun"></i> Light Mode' 
    : '<i class="fa-solid fa-moon"></i> Dark Mode';
});

// 2. Toggle Password Visibility
togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});

// 3. Dynamic Age Calculation
dobInput.addEventListener("change", () => {
  const dob = new Date(dobInput.value);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
  
  if (!isNaN(calculatedAge)) {
    document.getElementById("ageInfo").innerText = `Calculated Age: ${calculatedAge} years`;
  }
});

// 4. Live Password Strength Indicator
passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;
  let strength = 0;

  if (val.length >= 8) strength += 25;
  if (/[A-Z]/.test(val)) strength += 25;
  if (/[0-9]/.test(val)) strength += 25;
  if (/[@$!%*?&]/.test(val)) strength += 25;

  strengthBar.style.width = strength + "%";
  
  if (strength <= 25) strengthBar.style.backgroundColor = "#ef4444";
  else if (strength <= 75) strengthBar.style.backgroundColor = "#f59e0b";
  else strengthBar.style.backgroundColor = "#10b981";
});

// Helper Function: Sanitize Inputs (Secure Practice)
function sanitize(input) {
  return input.trim().replace(/[<>]/g, ""); // Strips basic tags to prevent client XSS
}

// Helper Function: Clear Error Messages
function clearErrors() {
  document.querySelectorAll(".error-msg").forEach(el => el.innerText = "");
}

// 5. Form Submit & Validation Handling
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();
  let isValid = true;

  // Sanitize Values
  const nameVal = sanitize(document.getElementById("fullName").value);
  const mobileVal = sanitize(document.getElementById("mobile").value);
  const emailVal = sanitize(document.getElementById("email").value);
  const passwordVal = passwordInput.value; // Don't strip symbols from passwords
  const confirmPasswordVal = document.getElementById("confirmPassword").value;
  const dobVal = dobInput.value;
  const bloodGroupVal = document.getElementById("bloodGroup").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const terms = document.getElementById("terms").checked;

  // Validate Full Name
  if (!patterns.fullName.test(nameVal)) {
    document.getElementById("nameError").innerText = "Enter a valid name (letters only, min 2 chars).";
    isValid = false;
  }

  // Validate Mobile
  if (!patterns.mobile.test(mobileVal)) {
    document.getElementById("mobileError").innerText = "Enter a valid 10-digit phone number.";
    isValid = false;
  }

  // Validate Email
  if (!patterns.email.test(emailVal)) {
    document.getElementById("emailError").innerText = "Enter a valid email address.";
    isValid = false;
  }

  // Validate Date of Birth
  if (!dobVal) {
    document.getElementById("dobError").innerText = "Please select a date of birth.";
    isValid = false;
  }

  // Validate Gender
  if (!gender) {
    document.getElementById("genderError").innerText = "Select a gender.";
    isValid = false;
  }

  // Validate Blood Group
  if (!bloodGroupVal) {
    document.getElementById("bloodGroupError").innerText = "Select a blood group.";
    isValid = false;
  }

  // Validate Password Complexity
  if (!patterns.password.test(passwordVal)) {
    document.getElementById("passwordError").innerText = "Must include Uppercase, Lowercase, Number & Special Char.";
    isValid = false;
  }

  // Validate Password Confirmation
  if (passwordVal !== confirmPasswordVal || confirmPasswordVal === "") {
    document.getElementById("confirmPasswordError").innerText = "Passwords do not match.";
    isValid = false;
  }

  // Validate Terms Checkbox
  if (!terms) {
    document.getElementById("termsError").innerText = "You must agree to the terms.";
    isValid = false;
  }

  // On Success
  if (isValid) {
    displaySummary({
      name: nameVal,
      mobile: mobileVal,
      email: emailVal,
      dob: dobVal,
      gender: gender.value,
      bloodGroup: bloodGroupVal
    });
  }
});

// Display Output Card
function displaySummary(data) {
  form.parentElement.classList.add("hidden");
  summarySection.classList.remove("hidden");

  summaryContent.innerHTML = `
    <table class="summary-table">
      <tr><td>Full Name:</td><td>${data.name}</td></tr>
      <tr><td>Mobile:</td><td>${data.mobile}</td></tr>
      <tr><td>Email:</td><td>${data.email}</td></tr>
      <tr><td>Date of Birth:</td><td>${data.dob}</td></tr>
      <tr><td>Gender:</td><td>${data.gender}</td></tr>
      <tr><td>Blood Group:</td><td>${data.bloodGroup}</td></tr>
    </table>
  `;
}

// Reset Form
document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  strengthBar.style.width = "0%";
  document.getElementById("ageInfo").innerText = "";
  summarySection.classList.add("hidden");
  form.parentElement.classList.remove("hidden");
});