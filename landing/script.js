// Stats
// Smooth number counting animation
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Animate stats when section comes into view
const statsSection = document.querySelector(".stats");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = document.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-count"));
          animateValue(stat, 0, target, 2000); // 2000ms = 2 second animation
        });
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

if (statsSection) {
  observer.observe(statsSection);
}

// Scroll Indicator & Header/Scroll-Top Effects
window.addEventListener("scroll", function () {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    // Check if element exists
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    scrollIndicator.style.width = progress + "%";
  }

  const header = document.querySelector(".header");
  if (header) {
    // Check if element exists
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  const scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    // Check if element exists
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }
});

// Scroll to top
const scrollTopButton = document.querySelector(".scroll-top");
if (scrollTopButton) {
  scrollTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Modal handling
const authModal = document.getElementById("auth-modal");
const openAuthModal = document.getElementById("open-auth-modal");
const closeAuthModal = document.getElementById("close-auth-modal");

openAuthModal.addEventListener("click", (e) => {
  e.preventDefault();
  authModal.style.display = "flex";
});

closeAuthModal.addEventListener("click", () => {
  authModal.style.display = "none";
});

authModal.addEventListener("click", (e) => {
  if (e.target === authModal) authModal.style.display = "none";
});

// Tab switching
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));
    button.classList.add("active");
    document
      .getElementById(`${button.dataset.tab}-tab`)
      .classList.add("active");
  });
});

// Password toggle
function togglePassword(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  toggle.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });
}

togglePassword("login-password", "toggle-login-password");
togglePassword("signup-password", "toggle-signup-password");

// Validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const length = password.length;

  // Count the number of criteria met
  const criteriaCount = hasUpper + hasLower + hasNumber + hasSpecial;

  if (length < 6) return { strength: "weak", score: 1 };
  if (length >= 6 && criteriaCount === 1) return { strength: "weak", score: 1 };
  if (length >= 6 && criteriaCount === 2)
    return { strength: "normal", score: 2 };
  if (length >= 8 && criteriaCount >= 3)
    return { strength: "strong", score: 3 };
  return { strength: "normal", score: 2 };
}

// User auth functions
function saveUser(name, email, password) {
  // Get existing users or initialize empty array
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return false; // User already exists
  }

  // Add new user
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Store current user with all info
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );
    return true;
  }

  return false;
}

function showUserProfile(user) {
  // If user is a string (for backward compatibility), convert to object
  if (typeof user === "string") {
    user = { email: user, name: "User" };
  }

  // Hide login button, show user profile
  document.getElementById("open-auth-modal").style.display = "none";

  const userProfile = document.getElementById("user-profile");
  const userEmail = document.getElementById("user-email");

  // Display user's name if available, otherwise email
  userEmail.textContent = user.name || user.email;
  userProfile.style.display = "flex";
}

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    try {
      // Try to parse as JSON (new format)
      const userObj = JSON.parse(currentUser);
      showUserProfile(userObj);
    } catch (e) {
      // If it's not JSON, it's the old format (just email)
      showUserProfile(currentUser);
    }
  }
});

function showMessage(message, isError = false) {
  const successMessage = document.getElementById("success-message");
  const messageText = document.getElementById("success-message-text");

  // Set message and color
  messageText.textContent = message;

  if (isError) {
    successMessage.style.backgroundColor = "var(--error-color)";
  } else {
    successMessage.style.backgroundColor = "var(--success-color)";
  }

  // Show message
  successMessage.classList.add("active");

  // Hide after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove("active");
  }, 3000);
}

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");

  // Show login button, hide user profile
  document.getElementById("open-auth-modal").style.display = "block";
  document.getElementById("user-profile").style.display = "none";

  showMessage("Successfully logged out");
});

// Login validation
document.getElementById("login-submit").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  let isValid = true;

  const emailError = document.getElementById("login-email-error");
  if (!email) {
    emailError.textContent = "Email is required";
    emailError.style.display = "block";
    isValid = false;
  } else if (!validateEmail(email)) {
    emailError.textContent = "Invalid email format";
    emailError.style.display = "block";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }

  const passwordError = document.getElementById("login-password-error");
  if (!password) {
    passwordError.textContent = "Password is required";
    passwordError.style.display = "block";
    isValid = false;
  } else {
    passwordError.style.display = "none";
  }

  if (isValid) {
    // Try to login
    const loginSuccessful = loginUser(email, password);

    if (loginSuccessful) {
      // Close modal
      authModal.style.display = "none";

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Show user profile
      showUserProfile(currentUser);

      // Show success message
      showMessage("Login successful!");

      // Don't redirect to search page
    } else {
      // Show error
      passwordError.textContent = "Invalid email or password";
      passwordError.style.display = "block";
    }
  }
});

// Signup validation
document.getElementById("signup-submit").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  let isValid = true;

  // Name validation
  const nameError = document.getElementById("signup-name-error");
  if (!name) {
    nameError.textContent = "Name is required";
    nameError.style.display = "block";
    isValid = false;
  } else {
    nameError.style.display = "none";
  }

  // Email validation
  const emailError = document.getElementById("signup-email-error");
  if (!email) {
    emailError.textContent = "Email is required";
    emailError.style.display = "block";
    isValid = false;
  } else if (!validateEmail(email)) {
    emailError.textContent = "Invalid email format";
    emailError.style.display = "block";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }

  // Password validation
  const passwordError = document.getElementById("signup-password-error");
  const passwordResult = validatePassword(password);
  if (!password) {
    passwordError.textContent = "Password is required";
    passwordError.style.display = "block";
    isValid = false;
  } else if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters";
    passwordError.style.display = "block";
    isValid = false;
  } else {
    passwordError.style.display = "none";
  }

  // Confirm password validation
  const confirmError = document.getElementById("confirm-password-error");
  if (password !== confirmPassword) {
    confirmError.textContent = "Passwords do not match";
    confirmError.style.display = "block";
    isValid = false;
  } else {
    confirmError.style.display = "none";
  }

  if (isValid) {
    // Try to save user
    const userSaved = saveUser(name, email, password);

    if (userSaved) {
      // Auto login the user
      loginUser(email, password);

      // Close modal and show success message
      authModal.style.display = "none";
      showMessage("Account created successfully!");

      // Get user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      // Show user profile
      showUserProfile(currentUser);

      // Clear signup form
      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
      document.getElementById("confirm-password").value = "";
    } else {
      emailError.textContent = "Email already registered";
      emailError.style.display = "block";
    }
  }
});

// Password strength indicator
const signupPassword = document.getElementById("signup-password");
const strengthBar = document.getElementById("password-strength");

signupPassword.addEventListener("input", () => {
  const result = validatePassword(signupPassword.value);
  strengthBar.className = `password-strength strength-${result.strength}`;
  strengthBar.style.width = `${result.score * 33.33}%`;
});
