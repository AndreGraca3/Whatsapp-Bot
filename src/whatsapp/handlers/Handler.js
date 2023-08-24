class Handler {
  constructor() {
    this.timeout = 0; // in seconds
    this.users = {};
    this.permissions = []; // TODO
  }

  isSpam(author) {
    if (this.timeout == 0) return false;
    const lastTriggeredByUser = this.users[author];
    const now = Date.now() / 1000;
    this.users[author] = now;
    if (now - (lastTriggeredByUser ?? 0) < this.timeout) return true;
    return false;
  }
}

module.exports = Handler;
