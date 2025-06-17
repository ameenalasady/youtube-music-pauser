let videoElement;
let attached = false;

// Function to find the video element and attach the event listener
function attachListener() {
  // YouTube's main video player element
  videoElement = document.querySelector('video.html5-main-video');

  if (videoElement && !attached) {

    videoElement.addEventListener('playing', () => {
      // Send a message to the background script
      browser.runtime.sendMessage({ action: "youtubeVideoPlaying" });
    });

    attached = true; // Mark as attached to prevent re-attaching
    clearInterval(findVideoInterval); // Stop checking once we've found it
  }
}

// YouTube pages are dynamic, so the video element might not exist on page load.
// We'll check for it every second until it's found.
const findVideoInterval = setInterval(attachListener, 1000);