// content-youtube.js
// This content script runs on regular youtube.com pages.
// Its purpose is to detect when a video starts playing and notify the background script.

// Function to add a 'play' event listener to a video element.
function addPlayListener(videoElement) {
    videoElement.addEventListener('play', () => {
        console.log('YTM Pauser: YouTube video has started playing.');
        // Send a message to the background script when a video starts playing.
        chrome.runtime.sendMessage({ action: "youtubeVideoPlaying" });
    });
}

// Use an interval to repeatedly check for the video element on the page.
// This is necessary because the video element might not be immediately available
// when the script runs, especially on dynamic pages like YouTube.
let videoFinder = setInterval(() => {
    const video = document.querySelector('video'); // Find the main video element.
    if (video) {
        // If the video element is found, add the play listener.
        addPlayListener(video);
        // Clear the interval once the video element is found and the listener is added
        // to avoid unnecessary checks.
        clearInterval(videoFinder);
    }
}, 500); // Check every 500 milliseconds.