const io = require('socket.io')(3000, {
    cors: {
        origin : ['http://localhost:8080'],
    },
})

io.on("connect", socket => {
    console.log(socket.id);
    socket.on('sendMessage', (msg, room) => {
        if(room === ''){
            socket.broadcast.emit('receive-message', msg)
        }
        else{
            socket.to(room).emit('receive-message', msg)
        }

    });
    socket.on('join-room', room => {
        socket.join(room)
    })
})