import {baserun} from 'baserun'
import * as dotenv from 'dotenv'
import {run} from "./agent";

function main() {
  dotenv.config()

  baserun.init()

  const userInput = process.argv[process.argv.length - 1];
  if (userInput !== __filename) {
    void baserun.trace(run)({userInput});
  } else {
    void baserun.trace(run)();
  }
}

main()