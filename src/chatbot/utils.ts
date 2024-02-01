import {ChatCompletionMessageParam, ChatCompletionMessageToolCall} from "openai/resources";
import * as fs from "fs";


export function persistConversation(conversation: ChatCompletionMessageParam[], conversationId: string) {
    // Persist the conversation to a JSON file and return stats about the saved file
    const conversationSerialized = JSON.stringify(conversation);
    const filename = `conversation-${conversationId}.json`;

    fs.writeFileSync(filename, conversationSerialized);
    const stat = fs.statSync(filename);
    return {size: stat.size, mode: stat.mode};
}

export function messageFromToolCall(tool_call: ChatCompletionMessageToolCall): ChatCompletionMessageParam {
    return {
        role: "assistant",
        content: "",
        tool_calls: [
            {
                id: tool_call.id,
                type: "function",
                function: {
                    name: tool_call.function.name,
                    arguments: tool_call.function.arguments,
                },
            }
        ],
    };
}
