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
            model: "stepfun/step-3.5-flash:free",
            messages: [
                {
                    role: "user",
                    content: "Create a 4 page presentation about the history of the internet, including key milestones and figures."
                }, {
                    role: "system",
                    content: SYSTEM_PROMPT
                }
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