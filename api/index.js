const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/suggest", async (req, res) => {
  try {
    const problem = req.body.problem;

    if (!problem) {
      return res.status(400).json({ error: "Problem missing" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `User's problem:\n${problem}`,
      config: {
        systemInstruction: `You are NextStep, a friendly and practical study and life guidance assistant.

Your job:
1. Understand the user's problem.
2. Briefly explain what they can do.
3. Give 3 to 5 clear steps.
4. Give one practical tip.
5. End with one simple next action.

Rules:
- Use simple language.
- Reply in the same language/style as the user.
- Be encouraging and realistic.
- Keep the answer concise and easy to follow.`
      }
    });

    res.json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI suggestion failed" });
  }
});

