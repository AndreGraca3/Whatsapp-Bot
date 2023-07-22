export function searchTriggers(input, words) {
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
