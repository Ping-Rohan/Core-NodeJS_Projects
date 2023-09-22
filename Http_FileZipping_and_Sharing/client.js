const http = require("http");
const { createReadStream } = require("fs");
const { createGzip } = require("zlib");
const { basename } = require("path");

const filename = process.argv[2];

const httpHeader = {
  hostname: "localhost",
  port: 8000,
  path: "/",
  method: "PUT",
  "Content-Encoding": "gzip",
  headers: {
    "X-Filename": basename(filename),
    "Content-Type": "application/zip",
  },
};

const request = http.request(httpHeader, (response) => {
  console.log(`Server response: ${response.statusCode}`);
});

createReadStream(filename).pipe(createGzip()).pipe(request);
