import express from "express";

export default function(api) {
    const router = express.Router();
    
    router.post('/send', api.sendMessage)
    return router
}