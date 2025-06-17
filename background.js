// This function finds the YouTube Music tab and sends it a "pause" message.
function pauseYouTubeMusic() {
  // Query for all tabs that are on the YouTube Music website
  browser.tabs.query({ url: "*://music.youtube.com/*" })
    .then((tabs) => {
      // For each found tab, send a message to its content script
      for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, { action: "pauseMusic" })
          .catch(error => console.error(`Could not send message to tab ${tab.id}: ${error}`));
      }
    });
}

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is the one we're expecting from the YouTube video listener
  if (message.action === "youtubeVideoPlaying") {
    pauseYouTubeMusic();
  }
});