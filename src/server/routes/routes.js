const express = require("express");

module.exports = function(api) {
    const router = express.Router();
    
    router.post('/send', api.sendMessage)
    return router
}