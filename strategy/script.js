// Theme toggle functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

// Check for saved theme preference
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme");
  icon.classList.replace("fa-moon", "fa-sun");
}

// Toggle theme when button is clicked
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  // Update icon
  if (body.classList.contains("dark-theme")) {
    icon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Import the marked library for Markdown rendering
import { marked } from "https://cdnjs.cloudflare.com/ajax/libs/marked/15.0.0/lib/marked.esm.js";

// Get references to DOM elements
const convElement = document.getElementById("conversation");
const promptInput = document.getElementById("prompt-input");
const spinner = document.getElementById("spinner");
const errorElement = document.getElementById("error");

/**
 * Process the streaming response and render messages as each chunk is received
 * @param {Response} response - The fetch response object
 */
async function onFetchResponse(response) {
  let text = "";
  let decoder = new TextDecoder();

  if (response.ok) {
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      text += decoder.decode(value);
      addMessages(text);
      spinner.classList.remove("active");
    }

    addMessages(text);
    promptInput.disabled = false;
    promptInput.focus();
  } else {
    const text = await response.text();
    console.error(`Unexpected response: ${response.status}`, {
      response,
      text,
    });
    throw new Error(`Unexpected response: ${response.status}`);
  }
}

/**
 * Parse response text and render messages in the conversation element
 * Message timestamp is used as a unique identifier to deduplicate/update messages
 * @param {string} responseText - The raw response text containing JSON messages
 */
function addMessages(responseText) {
  const lines = responseText.split("\n");
  const messages = lines
    .filter((line) => line.length > 1)
    .map((j) => JSON.parse(j));

  for (const message of messages) {
    // Use timestamp as a crude element id
    const { timestamp, role, content } = message;
    const id = `msg-${timestamp}`;

    let msgDiv = document.getElementById(id);
    if (!msgDiv) {
      msgDiv = document.createElement("div");
      msgDiv.id = id;
      msgDiv.title = `${role} at ${timestamp}`;
      msgDiv.classList.add("message", role);
      convElement.appendChild(msgDiv);
    }

    msgDiv.innerHTML = marked.parse(content);
  }

  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

/**
 * Handle errors by showing the error element and logging to console
 * @param {Error} error - The error that occurred
 */
function onError(error) {
  console.error(error);
  errorElement.style.display = "block";
  spinner.classList.remove("active");
}

/**
 * Handle form submission for sending a new message
 * @param {SubmitEvent} e - The submit event
 */
async function onSubmit(e) {
  e.preventDefault();
  spinner.classList.add("active");
  const body = new FormData(e.target);

  promptInput.value = "";
  promptInput.disabled = true;

  try {
    const response = await fetch("/chat/", { method: "POST", body });
    await onFetchResponse(response);
  } catch (error) {
    onError(error);
  }
}

// Initialize event listeners
document.querySelector("form").addEventListener("submit", onSubmit);

// Load messages on page load
fetch("/chat/").then(onFetchResponse).catch(onError);
