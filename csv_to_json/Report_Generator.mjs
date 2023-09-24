import { PassThrough } from "stream";
import { log } from "./logger.mjs";

class ReportGenerator {
  constructor({ sourceFileSize }) {
    this.sourceFileSize = sourceFileSize;
    this.totalBytes = 0;
  }

  onData(chunk) {
    this.totalBytes = this.totalBytes + chunk.length - 150;
    const percentage = (this.totalBytes * 100) / this.sourceFileSize;
    log("Processed " + percentage.toFixed(3).concat("%"));
  }

  onFinish() {
    log("Processing finished");
  }

  generateReport() {
    const passThrough = new PassThrough();
    passThrough.on("data", this.onData.bind(this));
    passThrough.on("end", this.onFinish.bind(this));
    return passThrough;
  }
}

export { ReportGenerator };
