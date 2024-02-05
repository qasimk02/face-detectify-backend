const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const Clarifai = require("clarifai");

async function handleTest(req, res) {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "908b630f37f64feaa8730fddf894db7f";
  const USER_ID = "qasim02";
  const APP_ID = "main";
  const MODEL_ID = "general-image-recognition";
  const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";
  const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

  const stub = ClarifaiStub.grpc();

  // This will be used by every Clarifai endpoint call
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
      inputs: [
        { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        res.json("Errors");
      }
      console.log(response);
      // Since we have one input, one output will exist here
      const output = response.outputs[0];
      res.json(output);
      console.log("Predicted concepts:");
    }
  );
}
module.exports = { handleTest };
