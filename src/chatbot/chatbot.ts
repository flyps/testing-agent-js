import {baserun} from 'baserun'
import * as tools from "./tools"
import OpenAI from "openai";
import {ChatCompletionMessageParam} from "openai/resources";
import {v4} from "uuid"
import readlineSync from "readline-sync";
import {messageFromToolCall, persistConversation} from "./utils";
import {callTool} from "./tools";
import * as util from "util";

const EXIT = "exit"
const PROMPT = `As a customer service representative for Joyful, the online pet product retailer, your main goal is to 
provide a positive and informative chat experience for customers inquiring about our products or their orders. 
Maintain a tone that is both approachable and professional, expressing empathy and offering apologies when a customer 
is dissatisfied.

Use the resources at your disposal, such as our product catalog, order tracking system, and FAQs, along with your 
knowledge of our products, to assist the customer. If a query falls beyond your capabilities or requires human 
intervention, smoothly transition the conversation to a live representative by stating, "I'm going to connect you 
with a member of our team who can assist you further," and then activate the \`escalate\` tool.`

export async function run() {
    const client = new OpenAI();
    const conversation: ChatCompletionMessageParam[] = [
        {role: "system", content: PROMPT},
    ];
    const conversationId = v4()

    let user_input = readlineSync.question(
        `Start your conversation. Type \`${EXIT}\` to end the conversation.\n> `,
    );

    const workflow = baserun.trace(async () => {
        while (user_input !== EXIT) {
            conversation.push({role: "user", content: user_input});
            const completion = await client.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: conversation,
                tools: tools.TOOLS_SCHEMA,
            });
            const message = completion.choices[0].message;
            const toolCalls = message.tool_calls;
            if (toolCalls) {
                for (const toolCall of toolCalls) {
                    conversation.push(messageFromToolCall(toolCall));
                    console.log(`-- Calling tool ${toolCall.function.name}`)
                    const result = callTool(toolCall, conversationId)
                    console.log(`-- Tool call result: ${util.inspect(result, false, null, true)}`)
                    conversation.push({role: "tool", content: JSON.stringify(result), tool_call_id: toolCall.id})
                }
            } else {
                const content = message.content;
                conversation.push({role: "assistant", content: content});
                user_input = readlineSync.question(`${content}\n> `);
            }

            // Persist the conversation and annotate the completion with its file stats
            const fileStats = persistConversation(conversation, conversationId);
            const annotation = baserun.annotate(completion.id);
            annotation.log("Conversation persistence", fileStats);
            await annotation.submit();
        }

        const userFeedback = readlineSync.question("How would you rate this conversation on a scale of 1 to 10?\n> ");
        const annotation = baserun.annotate();
        annotation.log("Conversation ID", {conversation_id: conversationId});
        annotation.feedback("Chatbot conversation rating", {score: parseInt(userFeedback)});
        await annotation.submit();

        return conversation;
    }, "Joyful chatbot");
    await workflow();
}
