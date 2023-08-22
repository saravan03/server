const io = require("socket.io")(4001, {
    cors: {
        origin: "https://doc-clone-client.web.app/",
        methods: ["GET", "POST"],
    },
})

io.on("connection", socket => {
    socket.on("send-changes", delta => {
        console.log(delta)
        socket.broadcast.emit("recieve-changes", delta)
    })
})