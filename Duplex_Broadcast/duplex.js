const { randomUUID } = require("crypto");
const { createReadStream } = require("fs");
const { Duplex, PassThrough, Writable } = require("stream");

const consumers = [randomUUID(), randomUUID(), randomUUID()];

const notify = consumers.map((id) => {
  return Writable({
    write(chunk, enc, cb) {
      console.log(`Consumer ${id} received chunk: ${chunk.toString()}`);
      cb(null);
    },
  });
});

function sendNotification(chunk) {
  notify.forEach((consumer) => {
    consumer.write(chunk);
  });
}

const broadcast = new PassThrough();
broadcast.on("data", sendNotification);

createReadStream(__dirname + "/message.txt")
  .pipe(broadcast)
  .pipe(process.stdout);
