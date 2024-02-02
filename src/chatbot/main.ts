import {baserun} from "baserun"
import * as dotenv from "dotenv"
import {userInfo} from "os"
import {createHash} from "crypto"

dotenv.config()

import {run} from "./chatbot";

async function main() {
    await baserun.init()
    const username = userInfo().username
    const usernameHash = createHash("sha256").update("user@example.com").digest("hex")
    await baserun.session(async () => {
        await run()
    }, {user: usernameHash})
}

main()
