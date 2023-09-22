const { createWriteStream } = require("fs");
const http = require("http");
const { basename } = require("path");
const { createGunzip } = require("zlib");

const server = http.createServer((request, response) => {
  console.log("Request headers", request.headers);
  request
    .pipe(createGunzip())
    .pipe(
      createWriteStream(basename("received_" + request.headers["x-filename"]))
    )
    .on("finish", () => {
      response.writeHead(200);
      response.end();
    });
});

server.listen(8000, () => console.log("Listening on port 8000"));
