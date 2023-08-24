function searchTriggers(input, words) {
  input = input.trim();
  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (
      input === word ||
      input.startsWith(word + " ") ||
      input.endsWith(" " + word)
    ) {
      return true;
    }
  }
  return false;
}

function formatTime(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

const delay = (time = 2000) =>
  new Promise((resolve, reject) => setTimeout(resolve, time));

module.exports = {
  searchTriggers,
  formatTime,
  delay,
};
