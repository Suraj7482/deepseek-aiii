import OpenAI from "openai";
import { Prompt } from "../model/promt.model.js";
import dotenv from "dotenv";

dotenv.config(); // Ensures environment variables are loaded before initializing OpenAI

const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1", // Fix: The OpenAI SDK automatically appends /chat/completions
        apiKey: process.env.DEEPSEEK_API_KEY,
});

export const sendPrompt = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // If you are using auth middleware, extract the user ID to associate it with the prompt.
        // Your JWT payload uses { id: user._id }, so you can access it like this:
        const userId = req.user ? req.user.id : null;

        // Save the user prompt immediately so it's not lost if the API request fails
        await Prompt.create({ role: "user", content: message, ...(userId && { userId }) });

        // THIS is where your API key is actually tested!
        //send to openai
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "deepseek/deepseek-chat", 
        });

        const aiResponse = completion.choices[0].message.content;

        // Save the assistant's response to your database
        await Prompt.create({ role: "assistant", content: aiResponse, ...(userId && { userId }) });

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        console.error("API Key or connection error:", error);
        res.status(500).json({ message: 'Failed to communicate with AI', error: error.message });
    }
};
