import { createServer } from "http";

// cannot surpass 30k request in 10 second

const server = createServer((request, response) => {
  // assume this as cpu intensive task
  for (let i = 0; i < 1000000; i++) {
    // do something
  }
  response.writeHead(200);
  response.end();
});

server.listen(3000);
