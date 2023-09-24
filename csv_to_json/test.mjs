import { CSV_TO_NDJSON } from "./index.mjs";

CSV_TO_NDJSON({ readSource: "./data.csv", outputFilePath: "output.ndjson" });
