import { OpenRouter } from "@openrouter/sdk";
import { SYSTEM_PROMPT } from "./agents/humanize";
import dotenv from "dotenv";
dotenv.config();

const openrouter = new OpenRouter({
    apiKey: process.env.LLM_API_KEY
});

async function main() {
    const stream = await openrouter.chat.send({
        chatGenerationParams: {
            model: "arcee-ai/trinity-large-preview:free",
            messages: [
                {
                    role: "user",
                    content: "Create a 5 slides presentation about Hitler"
                },
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
            ],
            stream: true
        }
    });

    let response = "";
    for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            response += content;
            process.stdout.write(content);
        }
    }
}
main();