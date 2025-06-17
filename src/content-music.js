// content-music.js
// This content script runs on music.youtube.com pages.
// Its purpose is to receive messages from the background script and pause the music player.

// Listen for messages from the background script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is the one we're expecting - an instruction to pause.
    if (request.action === "pauseYouTubeMusic") {
        console.log('YTM Pauser: Received instruction to pause music.');

        // Find the pause button element.
        // We use the '#play-pause-button' ID and check for the 'title="Pause"' attribute
        // because the button's title changes between "Pause" (when playing) and "Play" (when paused).
        // This ensures we only click it when music is actually playing.
        const pauseButton = document.querySelector('#play-pause-button[title="Pause"]');

        if (pauseButton) {
            // If the pause button is found (meaning music is playing), click it.
            pauseButton.click();
            // Send a response back to the background script indicating success.
            sendResponse({ status: "paused" });
        } else {
            // This branch is executed if the button with title "Pause" is not found.
            // This could mean the music is already paused or the button structure changed.
            sendResponse({ status: "already_paused_or_not_found" });
        }
    }
    // `return true` is necessary for asynchronous `sendResponse` calls.
    // It tells the browser that you will send a response later, allowing the channel to stay open.
    return true;
});