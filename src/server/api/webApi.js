export default function(client) {
    
    async function sendMessage(req, rsp) {
        const message = await client.sendMessage(req.body.chatId, req.body.content)
        rsp.json(message)
    }

    return {
        sendMessage
    }
}