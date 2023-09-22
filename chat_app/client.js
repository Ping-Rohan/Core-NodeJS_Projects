const net = require("net");
const { Writable, PassThrough } = require("stream");
const rl = require("readline");

function log(msg) {
  rl.cursorTo(process.stdout, 0);
  process.stdout.write(msg);
}

const writable = new Writable({
  objectMode: true,
  write(chunk, encoding, cb) {
    const { myId, id, msg } = JSON.parse(chunk);
    if (myId) {
      console.log("Connected to server with id " + myId);
    } else {
      log(`Message from ${id} : ${msg}`);
    }
    log("Type your message : ");
    cb(null);
  },
});

const socket = net.connect(8000);
const resetType = PassThrough();

resetType.on("data", () => {
  log("Type your message : ");
});

process.stdin.pipe(resetType).pipe(socket).pipe(writable);
