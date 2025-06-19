# YouTube Music Auto-Pauser

A browser extension that automatically pauses YouTube Music when a YouTube video starts playing.

---

## How It Works

The extension is built with three core JavaScript files that communicate with each other to achieve the auto-pausing functionality.

1.  **`content-youtube.js` (Runs on YouTube)**
    *   This script is injected into all regular `youtube.com` tabs.
    *   It listens for a video to start playing.
    *   When it detects that a video has started, it sends a message to the background script, notifying it of the event.

2.  **`background.js` (The Service Worker)**
    *   This is the central hub of the extension that runs in the background.
    *   It listens for the "video is playing" message from the `content-youtube.js` script.
    *   When it receives the message, it finds all open YouTube Music (`music.youtube.com`) tabs and sends a "pause the music" command to each of them.

3.  **`content-music.js` (Runs on YouTube Music)**
    *   This script is injected into all `music.youtube.com` tabs.
    *   It listens for the "pause the music" command from the `background.js` script.
    *   When it receives the command, it finds the pause button on the YouTube Music page and clicks it, pausing the audio.

This creates a simple and effective communication flow:
**YouTube Tab → Background Script → YouTube Music Tab**

---

## Installation

You can install this extension by downloading the appropriate ZIP file from the [**GitHub Releases page**](https://github.com/ameenalasady/youtube-music-pauser/releases/latest).

### For Chromium Browsers (Chrome, Edge, Brave, etc.)

1.  Download the `ytm-pauser-chromium-vX.X.X.zip` file from the latest release.
2.  **Unzip the file.** You should now have a folder named `ytm-pauser-chromium-vX.X.X`.
3.  Open your browser and navigate to the extensions page.
    *   **Chrome/Edge:** `chrome://extensions`
    *   **Brave:** `brave://extensions`
4.  Enable **Developer mode** using the toggle switch, usually found in the top-right corner.
5.  Click the **Load unpacked** button.
6.  Select the unzipped folder (`ytm-pauser-chromium-vX.X.X`) that you extracted in step 2.

The extension is now installed and active.

### For Firefox (Temporary Installation)

Since this add-on is not signed, you must install it temporarily using the debugging page. This installation will be removed when you close and restart Firefox.

1.  Download the `ytm-pauser-firefox-vX.X.X.zip` file from the latest release.
2.  **Unzip the file.** You should now have a folder named `ytm-pauser-firefox-vX.X.X`.
3.  Open Firefox and navigate to `about:debugging` in the address bar.
4.  Click on **This Firefox** in the sidebar.
5.  Click the **Load Temporary Add-on...** button.
6.  Navigate to the unzipped folder (`ytm-pauser-firefox-vX.X.X`) and select the `manifest.json` file.

The add-on is now installed and active until you close the browser.

---

## For Developers

### Building from Source

If you want to build the extension yourself, you can do so by following these steps.

**Prerequisites:**
*   [Node.js](https://nodejs.org/) (version 20 or later)
*   [Git](https://git-scm.com/)

**Build Steps:**
1.  Clone the repository:
    ```bash
    git clone https://github.com/ameenalasady/youtube-music-pauser.git
    cd youtube-music-pauser
    ```
2.  Install the required `npm` dependencies:
    ```bash
    npm install
    ```
3.  Run the build script:
    ```bash
    npm run build
    ```
The script will create browser-specific ZIP files in the `release/` directory.
