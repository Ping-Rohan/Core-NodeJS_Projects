import { cursorTo } from "readline";

function log(msg) {
  cursorTo(process.stdout, 0);
  process.stdout.write(msg);
}

export { log };
