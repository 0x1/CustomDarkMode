document.getElementById("toggle").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action: "toggle" }, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['content.js']
          },
          () => {
            chrome.tabs.sendMessage(tabId, { action: "toggle" });
          }
        );
      }
    });
  });
});

const brightnessSlider = document.getElementById("brightness");
const grayscaleSlider = document.getElementById("grayscale");
const sepiaSlider = document.getElementById("sepia");

function updateSettings() {
  const brightness = brightnessSlider.value;
  const grayscale = grayscaleSlider.value;
  const sepia = sepiaSlider.value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, {
      action: "updateSettings",
      brightness: parseFloat(brightness),
      grayscale: parseFloat(grayscale),
      sepia: parseFloat(sepia)
    }, (response) => {
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

brightnessSlider.addEventListener("input", updateSettings);
grayscaleSlider.addEventListener("input", updateSettings);
sepiaSlider.addEventListener("input", updateSettings);

chrome.storage.sync.get(["brightness", "grayscale", "sepia"], (data) => {
  brightnessSlider.value = data.brightness ?? 1;
  grayscaleSlider.value = data.grayscale ?? 0;
  sepiaSlider.value = data.sepia ?? 0.5;
});