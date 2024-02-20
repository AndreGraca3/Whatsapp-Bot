const { AI_IMAGE_API_TOKEN } = require("../../config/config");
const modelConfig = require("./modelConfig.json");

async function createPrediction(userPrompt) {
  const body = modelConfig;
  body.input.prompt = userPrompt;

  const rsp = await fetch(
    "https://tungsten.run/api/projects/mjpyeon/epic-realism/models/natural-sin-rc1-vae-base-v4.3/predict",
    {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `jwt=${AI_IMAGE_API_TOKEN}`,
      },
    }
  );
  if (!rsp.ok) throw new Error(`${rsp.status}: Failed to create a prediction: ${await rsp.text()}`);
  const data = await rsp.json();
  return data;
}

async function getPrediction(id) {
  const rsp = await fetch(`https://tungsten.run/api/predictions/${id}`);
  if (!rsp.ok) return Promise.reject("Failed to get prediction");
  return await rsp.json();
}

async function pollPrediction(id) {
  return await new Promise((resolve, reject) =>
    setTimeout(async () => {
      try {
        const prediction = await getPrediction(id);
        // status: "success" | "failed" | "pending" | "running"
        switch (prediction.status) {
          case "success":
            resolve(prediction);
            break;
          case "failed":
            reject("Prediction failed to complete");
            break;
          default:
            resolve(pollPrediction(id));
        }
      } catch (e) {
        reject(e);
      }
    }, 3000)
  );
}

async function cancelPrediction(id) {
  try {
    const rsp = await fetch(
      `https://tungsten.run/api/predictions/${id}/cancel`,
      {
        method: "POST",
      }
    );
  } catch (e) {
    console.error("Error cancelling prediction: ", e);
  }
}

async function generateImage(prompt) {
  const prediction = await createPrediction(prompt);
  const tid = setTimeout(() => {
    cancelPrediction(prediction.id);
  }, 60000);
  const res = await pollPrediction(prediction.id);
  clearTimeout(tid);
  return res.output.images[0];
}

module.exports = {
  generateImage,
};
