import {ChatAnthropic} from "langchain/chat_models/anthropic";
import {ChatOpenAI} from "langchain/chat_models/openai";
import { ConsoleCallbackHandler } from "langchain/callbacks"
import { SerpAPI, WikipediaQueryRun} from "langchain/tools";
import {Calculator} from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import * as readline from "node:readline/promises";
import { stdin, stdout } from 'node:process'
import { baserun } from 'baserun'
import {Provider} from "./constants";


function chooseLLM({provider, useStreaming}: {provider: Provider, useStreaming: boolean}) {
  switch (provider) {
    case Provider.OpenAI: {
      if (useStreaming) {
        return new ChatOpenAI({temperature: 0, modelName: "gpt-3.5-turbo-16k-0613", streaming: true, callbacks: [new ConsoleCallbackHandler()]})
      }
      return new ChatOpenAI({temperature: 0, modelName: "gpt-3.5-turbo-16k-0613"})
    }
    case Provider.Anthropic: {
      return new ChatAnthropic({streaming: useStreaming})
    }
    default:
      throw new Error(`Provider: ${provider} not yet supported`)
  }
}

export async function run({provider = Provider.OpenAI, userInput = "", useStreaming = false}: {provider?: Provider, userInput?: string, useStreaming?: boolean} = {}){
  if (!userInput) {
    const rl = readline.createInterface({input: stdin, output: stdout})
    userInput = await rl.question("What would you like me to do?\n> ")
    rl.close()
  }

  const llm = chooseLLM({provider, useStreaming})
  const tools = [new Calculator(), new WikipediaQueryRun()]
  if (process.env.SERP_API_KEY) {
    tools.push(new SerpAPI())
  }

  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "chat-zero-shot-react-description",
  })
  const result = await executor.run(userInput)
  console.log(result)
  baserun.log(`${provider} - ${useStreaming}`, {"input": userInput, "result": result})
  return result
}