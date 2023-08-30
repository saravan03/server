// const io = require("socket.io")(4001, {
//     cors: {
//         origin: "https://doc-clone-client.web.app",
//         methods: ["GET", "POST"],
//     },
// })




const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true);
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

const PORT = process.env.PORT || 3000;

app.post('/login', (req, res) => {
    console.log(req.body)
    if (!req.body) {
        return res.status(400).json({
            code: 400,
            message: "Invalid data"
        })
    }

    if (req.body.userName == "vivek" && req.body.password == "ileaf1234") {
        return res.status(200).json({
            id: 1,
            name: "vivek",
            email: "vivek@ileafsolutions.net"
        })
    } else if (req.body.userName == "saravan" && req.body.password == "ileaf1234") {
        return res.status(200).json({
            id: 2,
            name: "saravan",
            email: "saravan.c@ileafsolutions.net"
        })
    } else {
        return res.status(400).json({
            code: 400,
            message: "Invalid user"
        })
    }

});

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });
const onlineUsers = new Set();

io.on("connection", socket => {

    socket.on('join', (username) => {
        console.log('A user connected ', onlineUsers);

        onlineUsers.add(username);
        io.emit('online-users', Array.from(onlineUsers));
    });


    socket.on("send-changes", delta => {
        console.log(delta)
        socket.broadcast.emit("recieve-changes", delta)
    });
    socket.on('disconnect', () => {
        const username = Array.from(onlineUsers).find(u => u === socket.username);
        if (username) {
            onlineUsers.delete(username);
            io.emit('onlineUsers', Array.from(onlineUsers));
        }
        console.log('A user disconnected', onlineUsers);
    });
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
