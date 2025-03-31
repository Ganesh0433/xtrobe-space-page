import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDI_nBkIwy7OsZfuyKh6tUJZYHYwRa25tQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { prompt } = req.body;
        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        res.status(200).json({ reply });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
}
