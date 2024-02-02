import {ChatCompletionMessageToolCall, ChatCompletionTool} from "openai/resources";

export const TOOLS_SCHEMA: Array<ChatCompletionTool> = [
    {
        type: "function",
        function: {
            name: "get_products",
            description: "Get product information including prices and stock counts",
            parameters: {type: "object", properties: {}},
        },
    },
    {
        type: "function",
        function: {
            name: "order_lookup",
            description: "Looks up an order and shipping information",
            parameters: {
                type: "object",
                properties: {
                    email: {type: "string", description: "The user's email address"},
                },
                required: ["text"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "escalate",
            description: "Escalate this conversation to a human representative. Use if you are not likely to be " +
                "able to fulfill the customer's request",
            parameters: {type: "object", properties: {}},
        },
    },
];

export const DOG_LEASH = {name: "Tan Rope Dog Leash", brand: "Reddy", in_stock: 8, price: 9.99};

function get_products() {
    return [DOG_LEASH];
}

function order_lookup(email: string) {
    // Ignore email, just return a predefined order for testing
    return [{order_id: 1234, items: [DOG_LEASH], status: "shipped", arrival_date: new Date().toISOString()}];
}

function escalate(conversation_id: string) {
    return true;
}

export function callTool(toolCall: ChatCompletionMessageToolCall, conversationId: string) {
    switch (toolCall.function.name) {
        case "get_products":
            return get_products();
        case "order_lookup":
            return order_lookup(JSON.parse(toolCall.function.arguments).email);
        case "escalate":
            return escalate(conversationId);
        default:
            throw new Error(`function ${toolCall.function.name} not supported`);
    }
}