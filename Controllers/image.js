const Clarifai = require("clarifai");
const axios = require("axios");

const app = new Clarifai.App({
  //   apiKey: "770fd09af53f4bef9a5a053f57b14740",//old
  apiKey: "908b630f37f64feaa8730fddf894db7f", //new
});

// const handleApiCall = (req, res) => {

//   // https://www.clarifai.com/models/face-detection(clarifai api website)
//   if (!req.body.input) {
//     return res.status(400).json("Unable to get Image Url");
//   }
//   app.models
//     .predict(
//       //   Clarifai.FACE_DETECT_MODEL,
//       //   "d02b4508df58432fbb84e800597b8959",
//       "53e1df302c079b3db8a0a36033ed2d15", //We can use this also instead of
//       // above line both work in same way Sometimes the clarifai api didn't work
//       // so we can refer to this (https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js)
//       // and include above instead of what we have used
//       req.body.input
//     )
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json("Unable to work with api"));
// };

// making api requests to other api
const handleApiCall = (req, res) => {
  const imageUrl = req.body.input;
  axios
    .post("http://172.22.96.1:5000/detect_faces", {
      image_url: req.body.input.trim(),
    })
    .then((response) => {
      const responseData = response.data;
      res.json(responseData);
    })
    .catch((error) => {
      console.error("Error processing the image:", error.message);
      res.status(500).json({ error: "Error processing the image" });
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
