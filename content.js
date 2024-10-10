let isEnabled = false;
let brightness = 1;
let grayscale = 0;
let sepia = 0.5;

function applyDarkMode() {
  if (isEnabled) {
    document.documentElement.style.filter = `brightness(${brightness}) grayscale(${grayscale}) sepia(${sepia})`;
    document.documentElement.style.backgroundColor = "#222";
    
    // Invert only the background and adjust text color
    document.querySelectorAll('*').forEach(el => {
      const bgColor = window.getComputedStyle(el).backgroundColor;
      const textColor = window.getComputedStyle(el).color;
      if (bgColor && isBright(bgColor)) {
        el.style.backgroundColor = invertColor(bgColor);
      }
      if (textColor && !isBright(textColor)) {
        el.style.color = "#f0f0f0"; // Light text color for dark backgrounds
      }
    });
  } else {
    document.documentElement.style.filter = "";
    document.documentElement.style.backgroundColor = "";
    document.querySelectorAll('*').forEach(el => {
      el.style.backgroundColor = "";
      el.style.color = "";
    });
  }
}

function isBright(color) {
  const rgb = color.match(/\d+/g);
  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  return brightness > 128;
}

function invertColor(color) {
  const rgb = color.match(/\d+/g);
  return `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`;
}

chrome.storage.sync.get(["isEnabled", "brightness", "grayscale", "sepia"], (data) => {
  isEnabled = data.isEnabled ?? false;
  brightness = data.brightness ?? 1;
  grayscale = data.grayscale ?? 0;
  sepia = data.sepia ?? 0.5;
  applyDarkMode();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ isEnabled });
    applyDarkMode();
  } else if (request.action === "updateSettings") {
    brightness = request.brightness;
    grayscale = request.grayscale;
    sepia = request.sepia;
    chrome.storage.sync.set({ brightness, grayscale, sepia });
    applyDarkMode();
  }
});