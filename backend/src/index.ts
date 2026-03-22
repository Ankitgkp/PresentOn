import { OpenRouter } from "@openrouter/sdk";
import { ANTI_PLAGIARISM_LAYER } from "./agents/anti_plagiarism_agent";
import dotenv from "dotenv";
dotenv.config();

// Passed the OpenRouter API to use the Step-3.5-Flash model
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
                    content: "Create a 4 page presentation about hitler"
                }, {
                    role: "system",
                    content: ANTI_PLAGIARISM_LAYER
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