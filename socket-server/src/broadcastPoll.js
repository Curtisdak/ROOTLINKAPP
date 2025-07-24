export const broadcastPollCreation = (app, io) => {

    app.post("/broadcast-new-poll", (req, res) => {
        const { event, data } = req.body;
        if (!event) {
            return res.status(400).json({ error: "Missing event name" });
        }

        io.emit(event, data); // Broadcast to all clients
        res.json({ success: true });

    })


    app.post("/broadcast-updated-poll", (req, res) => {

        const { event, data } = req.body;

        if (!event) {
            return res.status(400).json({ error: "Missing UPDATED  event name" })
        }
        io.emit(event, data)
        res.json({ success: true })
    })
}