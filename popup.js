// Event listener for the toggle button
document.getElementById("toggle").addEventListener("click", () => {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    // Send a "toggle" message to the content script
    chrome.tabs.sendMessage(tabId, { action: "toggle" }, (response) => {
      // If the content script is not loaded (e.g., on a new tab), inject it
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['content.js']
          },
          () => {
            // After injection, send the "toggle" message again
            chrome.tabs.sendMessage(tabId, { action: "toggle" });
          }
        );
      }
    });
  });
});

// Get references to the slider elements
const brightnessSlider = document.getElementById("brightness");
const grayscaleSlider = document.getElementById("grayscale");
const sepiaSlider = document.getElementById("sepia");

// Function to update settings when sliders change
function updateSettings() {
  const brightness = brightnessSlider.value;
  const grayscale = grayscaleSlider.value;
  const sepia = sepiaSlider.value;

  // Send updated settings to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, {
      action: "updateSettings",
      brightness: parseFloat(brightness),
      grayscale: parseFloat(grayscale),
      sepia: parseFloat(sepia)
    }, (response) => {
      // If the content script is not loaded, inject it and send settings again
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['content.js']
          },
          () => {
            chrome.tabs.sendMessage(tabId, {
              action: "updateSettings",
              brightness: parseFloat(brightness),
              grayscale: parseFloat(grayscale),
              sepia: parseFloat(sepia)
            });
          }
        );
      }
    });
  });
}

// Add event listeners to sliders
brightnessSlider.addEventListener("input", updateSettings);
grayscaleSlider.addEventListener("input", updateSettings);
sepiaSlider.addEventListener("input", updateSettings);

// Load saved settings from storage and update slider values
chrome.storage.sync.get(["brightness", "grayscale", "sepia"], (data) => {
  brightnessSlider.value = data.brightness ?? 1;
  grayscaleSlider.value = data.grayscale ?? 0;
  sepiaSlider.value = data.sepia ?? 0.5;
});