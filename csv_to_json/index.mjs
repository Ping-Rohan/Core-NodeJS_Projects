import { Transform, PassThrough } from "stream";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream, statSync } from "fs";
import { ReportGenerator } from "./Report_Generator.mjs";

class CSVToJSON extends Transform {
  #delimeter;
  #header;
  #headerParsed;
  #buffer;
  constructor({ delimeter }) {
    super({ objectMode: true, highWaterMark: 64 });
    this.#delimeter = delimeter || ",";
    this.#header = "";
    this.#buffer = Buffer.alloc(0);
    this.#headerParsed = false;
  }

  *#parseData(chunk) {
    this.#buffer = Buffer.concat([this.#buffer, chunk]);
    const document_separated_by_newline = this.#buffer.toString().split("\r\n");

    if (!this.#headerParsed) {
      this.#header = document_separated_by_newline.shift().split(",");
      this.#headerParsed = true;
    }

    const uncompleted_line = document_separated_by_newline.pop();
    this.#buffer = Buffer.from(uncompleted_line);

    for (let document of document_separated_by_newline) {
      let HEADER_PROPS_COUNT = 0;
      const obj = new Object();
      const splittedDoc = document.split(this.#delimeter);
      const header_alias = [...this.#header];
      while (HEADER_PROPS_COUNT < this.#header.length) {
        obj[header_alias.shift()] = splittedDoc.shift();
        HEADER_PROPS_COUNT++;
      }
      yield Buffer.from(JSON.stringify(obj).concat("\n"));
    }
  }

  _transform(chunk, enc, cb) {
    for (const processedData of this.#parseData(chunk)) {
      this.push(processedData);
    }
    return cb(null);
  }
}

async function CSV_TO_NDJSON({ readSource, outputFilePath }) {
  const { size: sourceFileSize } = statSync(readSource);
  const reportGenerator = new ReportGenerator({ sourceFileSize });
  await pipeline(
    createReadStream(readSource),
    new CSVToJSON({ delimeter: "," }),
    reportGenerator.generateReport.apply(reportGenerator),
    createWriteStream(outputFilePath)
  );
}

export { CSV_TO_NDJSON };
