import {baserun} from 'baserun'
import * as dotenv from 'dotenv'

dotenv.config()

import {run} from "./agent";

async function main() {
    await baserun.init()
    const userInput = process.argv[process.argv.length - 1];
    if (userInput !== __filename) {
        void baserun.trace(run)({userInput});
    } else {
        void baserun.trace(run)();
    }
}

main()
