const { randomUUID } = require("crypto");
const net = require("net");
const { Writable } = require("stream");

const client = new Map();

function populateBroadcast(data) {
  client.forEach((socket) => {
    if (socket.clientId.slice(0, 5) !== data.id) {
      socket.write(JSON.stringify(data));
    }
  });
}

const broadCastToAll = (socket) => {
  return Writable({
    write(chunk, enc, cb) {
      const data = chunk.toString();
      const id = socket.clientId.slice(0, 5);
      populateBroadcast({ id, msg: data });
      cb(null);
    },
  });
};

const server = net.createServer((socket) => {
  // redirect message to same client
  socket.pipe(broadCastToAll(socket));
});

server.listen(8000, () => {
  console.log("Server started listening on port number : 8000");
});

server.on("connection", (socket) => {
  socket.clientId = randomUUID();
  client.set(socket.clientId, socket);
  console.log("New client connected with id : ", socket.clientId.slice(0, 5));
  socket.write(JSON.stringify({ myId: socket.clientId.slice(0, 5) }));

  socket.on("error", (err) => {
    console.error(
      "Socket error for client id or client left",
      socket.clientId.slice(0, 5)
    );
    client.delete(socket.clientId);
  });

  socket.on("close", () => {
    console.log("Client disconnected with id : ", socket.clientId.slice(0, 5));
    if (socket && socket.clientId) {
      client.delete(socket.clientId);
    }
  });
});
