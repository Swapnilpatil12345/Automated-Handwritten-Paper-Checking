const axios = require("axios");
const fs = require("fs");

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = true;

// Read and encode the image
const imagePath = "samplePaper.jpg";
const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

if (imageBase64.length >= 180000) {
  console.error("To upload larger images, use the assets API (see docs)");
  process.exit(1);
}

const headers = {
  Authorization: "Bearer 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",
  Accept: stream ? "text/event-stream" : "application/json",
};

const payload = {
  model: "microsoft/phi-3.5-vision-instruct",
  messages: [
    {
      role: "user",
      content: `recognize text from it <img src="data:image/jpeg;base64,${imageBase64}" />`,
    },
  ],
  max_tokens: 512,
  temperature: 0.2,
  top_p: 0.7,
  stream: stream,
};

async function extractText() {
  try {
    const response = await axios.post(invokeUrl, payload, {
      headers,
      responseType: "stream",
    });

    let fullText = "";
    let previousChunk = "";

    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");

      lines.forEach((line) => {
        if (!line.trim() || line.trim() === "[DONE]" || line.trim() === "{}") return;

        try {
          const jsonData = JSON.parse(line.replace("data: ", "").trim());

          if (jsonData.choices && jsonData.choices.length > 0) {
            const textChunk = jsonData.choices[0].delta?.content?.trim() || "";

            if (textChunk) {
              // Add space only if needed
              if (previousChunk && !previousChunk.endsWith(" ")) {
                fullText += " " + textChunk;
              } else {
                fullText += textChunk;
              }

              previousChunk = textChunk;
            }
          }
        } catch (err) {
          console.warn(`Skipping invalid JSON line: ${line}`);
        }
      });
    });

    response.data.on("end", () => {
      console.log("\nFinal Extracted Text:\n", fullText.trim());
    });

  } catch (error) {
    console.error("Error processing request:", error.message);
  }
}

extractText();
