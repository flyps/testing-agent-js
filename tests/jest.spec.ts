import { baserun } from 'baserun';
import {run} from "../src/agent";
import {Provider} from "../src/constants";

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

    baserun.evals.includes("OpenAI Streaming", result, ["Zeilinger"])
  })

  it("handles anthropic non streaming", async () => {
    const result = await run({
      provider: Provider.Anthropic,
      useStreaming: false,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("Anthropic Non-Streaming", result, ["Zeilinger"])
  })

  it("handles anthropic streaming", async () => {
    const result = await run({
      provider: Provider.Anthropic,
      useStreaming: true,
      userInput: "who won the 2022 nobel price in physics"
    })

    baserun.evals.includes("Anthropic Streaming", result, ["Zeilinger"])
  })
})