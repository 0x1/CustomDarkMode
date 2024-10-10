## Explanation of Permissions

1. **activeTab**:
   - Grants access to information about the currently active tab.
   - Allows the extension to:
     - Retrieve the current page's URL.
     - Inject scripts (e.g., `content.js`) into the page.
     - Interact with the tab's content.
   - This permission is more privacy-friendly as it only activates when the user interacts with the extension.

2. **storage**:
   - Enables the extension to use Chrome's storage API.
   - Allows the extension to:
     - Save settings and preferences (e.g., dark mode, brightness, grayscale, sepia).
     - Retrieve these settings across browser sessions.