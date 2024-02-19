const async = require("async");

/**
 * Searches for triggers in a string
 * @param {string} input - The string to be searched.
 * @param {Array} words - The words to be searched for.
 * @returns {string} - The first word found in the string, undefined if none is found.
 */
function searchTriggers(input, words) {
  input = input.trim();
  for (let i = 0; i < words.length; i++) {
    const word = words[i].trim();
    if (
      input === word ||
      input.startsWith(word + " ") ||
      input.endsWith(" " + word)
    )
      return word;
  }
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

/*
 * Returns a string representing the time since a given timestamp
 * @param {number} seconds - The timestamp in seconds
 * @returns {string} - The time since the timestamp, in the format "1 year", "2 months", "3 days", etc.
 */
function timeSince(seconds) {
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const intervalCount = Math.floor(seconds / interval.seconds);
    if (intervalCount > 0) {
      const label = interval.label + (intervalCount > 1 ? "s" : "");
      return `${intervalCount} ${label}`;
    }
  }
  return "now";
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * A queue for async tasks.
 */
class Queue {
  constructor(delayTime) {
    this.queue = async.queue(async (task, callback = () => {}) => {
      await task();
      await delay(delayTime);
    }, 1);
  }

  enqueue(task) {
    this.queue.push(task);
  }

  isEmpty() {
    return this.queue.length == 0;
  }
}

module.exports = {
  searchTriggers,
  formatTime,
  timeSince,
  delay,
  Queue,
};
