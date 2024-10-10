// Global variables to store the current state and settings
let isEnabled = false;
let brightness = 1;
let grayscale = 0;
let sepia = 0.5;

// Function to apply or remove dark mode based on current settings
function applyDarkMode() {
  if (isEnabled) {
    // Apply filters to the entire document
    document.documentElement.style.filter = `brightness(${brightness}) grayscale(${grayscale}) sepia(${sepia})`;
    document.documentElement.style.backgroundColor = "#222";
    
    // Iterate through all elements to adjust background and text colors
    document.querySelectorAll('*').forEach(el => {
      const bgColor = window.getComputedStyle(el).backgroundColor;
      const textColor = window.getComputedStyle(el).color;
      // Invert bright background colors
      if (bgColor && isBright(bgColor)) {
        el.style.backgroundColor = invertColor(bgColor);
      }
      // Adjust dark text colors to be more visible
      if (textColor && !isBright(textColor)) {
        el.style.color = "#f0f0f0"; // Light text color for dark backgrounds
      }
    });
  } else {
    // Remove all applied styles when dark mode is disabled
    document.documentElement.style.filter = "";
    document.documentElement.style.backgroundColor = "";
    document.querySelectorAll('*').forEach(el => {
      el.style.backgroundColor = "";
      el.style.color = "";
    });
  }
}

// Function to determine if a color is bright
function isBright(color) {
  const rgb = color.match(/\d+/g);
  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  return brightness > 128;
}

// Function to invert a color
function invertColor(color) {
  const rgb = color.match(/\d+/g);
  return `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`;
}

// Load saved settings from storage and apply dark mode
chrome.storage.sync.get(["isEnabled", "brightness", "grayscale", "sepia"], (data) => {
  isEnabled = data.isEnabled ?? false;
  brightness = data.brightness ?? 1;
  grayscale = data.grayscale ?? 0;
  sepia = data.sepia ?? 0.5;
  applyDarkMode();
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    // Toggle dark mode on/off
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ isEnabled });
    applyDarkMode();
  } else if (request.action === "updateSettings") {
    // Update settings when sliders change
    brightness = request.brightness;
    grayscale = request.grayscale;
    sepia = request.sepia;
    chrome.storage.sync.set({ brightness, grayscale, sepia });
    applyDarkMode();
  }
});