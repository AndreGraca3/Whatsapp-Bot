const users = {};

module.exports = function isSpam(author) {
  const lastTriggeredByUser = users[author];
  const now = Date.now() / 1000;
  users[author] = now;
  if (now - (lastTriggeredByUser ?? 0) < 5) return true;
  return false;
};
