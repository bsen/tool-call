const express = require("express");
const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config();
const companies = require("./compfigs");

const app = express();
const port = 3001;

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function callCompanyAPI(companyId, functionName, args) {
  const company = companies[companyId];
  if (!company) {
    throw new Error("Company not found");
  }

  const functionConfig = company.functions.find((f) => f.name === functionName);
  if (!functionConfig) {
    throw new Error("Function not found for company");
  }

  const paramKey = Object.keys(args)[0];
  const endpoint = `${company.apiBaseUrl}${functionConfig.endpoint}/${args[paramKey]}`;

  console.log(`[Chat] Calling company API: ${endpoint}`);
  try {
    const response = await axios.get(endpoint);
    console.log(`[Chat] API call successful`);
    return response.data;
  } catch (error) {
    console.error(`[Chat] API call failed: ${error.message}`);
    throw error;
  }
}

async function processCompanyMessage(companyId, userMessage) {
  console.log(
    `[Chat] Processing message for company ${companyId}: ${userMessage}`
  );

  const company = companies[companyId];
  if (!company) {
    throw new Error("Company not found");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful customer support assistant for ${company.name}.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      functions: company.functions,
      function_call: "auto",
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      console.log(
        `[Chat] Function call requested: ${responseMessage.function_call.name}`
      );
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);

      const functionResult = await callCompanyAPI(
        companyId,
        functionName,
        functionArgs
      );

      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful customer support assistant for ${company.name}. Give result in most natual way, if you get something in json or  with quotes make it most possible natural and easy to understand. for eg \"in-progress\" dont give like this, it should be its in progress`,
          },
          {
            role: "user",
            content: userMessage,
          },
          responseMessage,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(functionResult),
          },
        ],
      });

      return finalResponse.choices[0].message.content;
    }

    return responseMessage.content;
  } catch (error) {
    console.error(`[Chat] Error processing message: ${error.message}`);
    throw error;
  }
}

app.post("/chat", async (req, res) => {
  console.log(`[Chat API] Received chat request`);
  try {
    const { companyId } = req.query;
    const { message } = req.body;

    if (!companyId) {
      return res
        .status(400)
        .json({ error: "Company ID is required in query parameters" });
    }

    if (!message) {
      return res
        .status(400)
        .json({ error: "Message is required in request body" });
    }

    if (!companies[companyId]) {
      return res.status(404).json({ error: "Company not found" });
    }

    console.log(`[Chat API] Processing for company: ${companyId}`);
    const response = await processCompanyMessage(companyId, message);
    res.json({ response });
  } catch (error) {
    console.error(`[Chat API] Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`[Chat] Server running on http://localhost:${port}`);
});
