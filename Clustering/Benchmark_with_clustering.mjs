import cluster from "node:cluster";
import { createServer } from "http";
import { cpus } from "node:os";

// surpass 64k request in 10s

const available_cors = cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Clustering to ${available_cors} cors`);

  // reswapn automatically
  cluster.on("exit", (worker, code) => {
    if (!worker.exitedAfterDisconnect) {
      cluster.fork();
    }
  });
  for (let i = 0; i < available_cors; i++) {
    cluster.fork();
  }
} else {
  // to test reswapn
  //   setTimeout(() => {
  //     throw new Error("Something went wrong");
  //   }, 2000);

  const server = createServer((request, response) => {
    // assume this as cpu intensive task
    for (let i = 0; i < 1000000; i++) {
      // do something
    }
    response.writeHead(200);
    response.end();
  });
  server.listen(3000, () => {
    console.log(`Started server ${process.pid}`);
  });
}
