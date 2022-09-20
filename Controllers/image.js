const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '770fd09af53f4bef9a5a053f57b14740'
   });

const handleApiCall = (req,res) => {
    // https://www.clarifai.com/models/face-detection(clarifai api website)
    if(!req.body.input){
        return res.status(400).json("Unable to get Image Url");
    }
    app.models
            .predict(
              Clarifai.FACE_DETECT_MODEL,
              // '53e1df302c079b3db8a0a36033ed2d15', //We can use this also instead of 
              // above line both work in same way Sometimes the clarifai api didn't work 
              // so we can refer to this (https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js) 
              // and include above instead of what we have used
              req.body.input)
              .then(data => res.json(data))
              .catch(err => res.status(400).json("Unable to work with api"))
}

const handleImage = (req,res,db) =>{
    const {id} = req.body
    db('users').where('id', '=', id)
        .increment('entries',1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('Unable to get entries'))
    // By using local database
    // database.users.forEach(user => {
    //     if(user.id === Number(id)){
    //         found = true;
    //         user.entries++
    //         return res.json(user.entries);
    //     }
    // })
    // if(!found){
    //      res.status(400).json("Not found");
    // }
}

module.exports = {
    handleImage,
    handleApiCall
}