const express = require("express");
const axios = require("axios");
const openaiRouter = express.Router();
require("dotenv").config();

const API_KEY = process.env.OPENAI_API_KEY;

openaiRouter.post("/generate", async (req, res) => {
  try {
    const { action, content, targetLanguage } = req.body;

    if (!content || !action) {
      return res.status(400).json({ error: "content and action are required" });
    }

    let responseContent = "";

    if (action === "codeConvert") {
      // Use GPT-3.5-turbo for code conversion
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `convert the given ${content} to the given ${targetLanguage}`,
          },
        ],
        max_tokens: 100,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else if (action === "debugCode") {
      if (!content) {
        return res.status(400).json({ error: "content is required for summarization" });
      }

      // Use GPT-3.5-turbo for code debug with a specific prompt
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Debug the following code: ${content}`,
          },
        ],
        max_tokens: 100,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else if (action === "checkQuality") {
      if (!content) {
        return res.status(400).json({ error: "content is required to check quality" });
      }

      // Use GPT-3.5-turbo for code quality checking
      const gptRequest = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `check the quality of code: ${content} and give rating.Based on code potential for improvement, code organization and structure`,
          },
        ],
        max_tokens: 200,
      };

      const gptResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        gptRequest,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      responseContent = gptResponse.data.choices[0].message.content;
    } else {
      return res.status(400).json({ error: "Invalid action specified" });
    }

    res.json({ result: responseContent });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = openaiRouter;
