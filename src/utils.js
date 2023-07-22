export function searchTriggers(str, words) {
    const regex = new RegExp(`\\b${substring}|${substring}\\b`, 'i');
    return words.some(word => regex.test(word));
}