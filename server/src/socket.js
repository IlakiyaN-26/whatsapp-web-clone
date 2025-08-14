function initSocket(server, cors) {
    const { Server } = require('socket.io');
    const io = new Server(server, { cors: { origin: cors, credentials: false } });
    io.on('connection', (socket) => {
    console.log(' client connected', socket.id);
});
return io;
}
module.exports = initSocket;