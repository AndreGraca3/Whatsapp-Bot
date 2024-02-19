async function createPrediction(prompt) {
  const body = {
    input: {
      prompt,
      negative_prompt:
        "asian, chinese, error, cropped, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark",
      num_outputs: 1,
      width: 512,
      height: 768,
      enhance_face_with_adetailer: false,
      enhance_hands_with_adetailer: false,
      adetailer_denoising_strength: 0.55,
      detail: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      seed: -1,
      input_image_redrawing_strength: 0.55,
      reference_image_strength: 1,
      reference_pose_strength: 1,
      reference_depth_strength: 1,
      sampler: "Restart",
      samping_steps: 20,
      cfg_scale: 6,
      clip_skip: 2,
      vae: "None",
      disable_prompt_modification: false,
    },
    is_demo: true,
  };

  const rsp = await fetch(
    "https://tungsten.run/api/projects/mjpyeon/epic-realism/models/natural-sin-rc1-vae-base-v4.3/predict",
    {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie:
          "jwt=t_at_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTI1NDcsImV4cCI6MTcxMDkwNTM1MSwic3VkbyI6ZmFsc2UsInN1ZG9fZXhwIjpudWxsfQ.6Dx7cMB9Evvx_wxMe6ZHACKJTdDOzkVAqfIv44ZFxWA",
      },
    }
  );
  if (!rsp.ok) {
    if (rsp.status != 500) {
      const p = await rsp.json();
      console.log(p);
    }
    throw new Error(`${rsp.status}: Failed to create a prediction`);
  }
  const data = await rsp.json();
  return data;
}

async function getPrediction(id) {
  const rsp = await fetch(`https://tungsten.run/api/predictions/${id}`);
  if (!rsp.ok) {
    return Promise.reject("Failed to get prediction");
  }
  const data = await rsp.json();
  return data;
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
    if (isPending) cancelPrediction(prediction.id);
  }, 60000);
  const res = await pollPrediction(prediction.id);
  clearTimeout(tid);
  return res.output.images[0];
}

module.exports = {
  generateImage,
};
