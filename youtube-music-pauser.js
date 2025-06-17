// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is the "pauseMusic" action
  if (request.action === "pauseMusic") {

    // Find the main play/pause button on YouTube Music
    // We specifically look for the one that shows "Pause" as its title,
    // which means music is currently playing.
    const pauseButton = document.querySelector('#play-pause-button[title="Pause"]');

    if (pauseButton) {
      pauseButton.click();
    }
  }
});