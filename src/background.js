// background.js
// This is the service worker script that runs in the background.
// It acts as an intermediary between the content scripts.
// It listens for messages from the youtube.com content script and sends messages
// to the music.youtube.com content script.

// Listen for the message from the YouTube content script (src/content-youtube.js).
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message indicates a YouTube video has started playing.
    if (request.action === "youtubeVideoPlaying") {
        console.log('YTM Pauser: Background script detected video playback.');

        // Query for all tabs that match the YouTube Music URL pattern.
        // This finds all open YouTube Music tabs.
        chrome.tabs.query({ url: "*://music.youtube.com/*" }, (tabs) => {
            if (tabs.length > 0) {
                // If YouTube Music tabs are found, iterate through them.
                tabs.forEach(tab => {
                    // Send a message to the content script running in each YouTube Music tab.
                    // The message instructs the content script to pause the music.
                    chrome.tabs.sendMessage(tab.id, { action: "pauseYouTubeMusic" }, (response) => {
                        // Check for errors, e.g., if the content script hasn't loaded yet in the tab.
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        } else {
                            // Log the response received from the content script (e.g., "paused").
                            console.log(`YTM Pauser: Response from tab ${tab.id}:`, response.status);
                        }
                    });
                });
            } else {
                // Log if no YouTube Music tabs are currently open.
                console.log('YTM Pauser: No YouTube Music tab found.');
            }
        });
    }
    // Keep the message channel open for an async response.
    // Although we don't explicitly call sendResponse here for the initial message,
    // the tabs.query and sendMessage calls are asynchronous, so returning true
    // is good practice when dealing with potential async operations within the listener.
    return true;
});

// A simple log to confirm the background script (service worker) has started.
console.log('YTM Pauser: Background service worker started.');