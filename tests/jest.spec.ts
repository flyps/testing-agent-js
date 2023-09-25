import { baserun } from 'baserun';
import {run} from "../demo/agent";
import {Provider} from "../demo/constants";

describe("jest baserun tests", () => {
  it('handles openai non streaming', async () => {
    const result = await run({
      provider: Provider.OpenAI,
      useStreaming: false,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("OpenAI Non-Streaming", result, ["Zeilinger"])
  })

  it('handles openai streaming', async () => {
    const result = await run({
      provider: Provider.OpenAI,
      useStreaming: true,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("OpenAI Non-Streaming", result, ["Zeilinger"])
  })

  it("handles anthropic non streaming", async () => {
    const result = await run({
      provider: Provider.Anthropic,
      useStreaming: false,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("OpenAI Non-Streaming", result, ["Zeilinger"])
  })

  it("handles anthropic streaming", async () => {
    const result = await run({
      provider: Provider.Anthropic,
      useStreaming: true,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("OpenAI Non-Streaming", result, ["Zeilinger"])
  })
})