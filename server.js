const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const app = express();

const signIn = require("./Controllers/signin");
const register = require("./Controllers/register");
const profile = require("./Controllers/profile");
const image = require("./Controllers/image");
const test = require("./Controllers/test");

//Postgress databse used
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "qasim@123",
    database: "face_detectify",
  },
});

// Created a loclal database before connecting it to original database.
// const database = {
//     users : [
//         {
//             id: 123,
//             name: 'Qasim',
//             email: 'qassy@gmail.com',
//             password: 'qassu123',
//             entries: 0,
//             joined : new Date()
//         },
//         {
//             id: 124,
//             name: 'Kavish',
//             email: 'kavish@gmail.com',
//             password: 'kavish123',
//             entries: 0,
//             joined : new Date()
//         }
//     ],
//     login : [
//         {
//             id: 234,
//             hash: '',
//             email: 'qassy@gmail.com'
//         }
//     ]
// }

//  Middlewares
app.use(express.json()); //To parse the json (bodyparser)
app.use(cors()); //Cors allows us to configure and manage an HTTP server to access resources from the same domain.

//Checking whether our server is working or not by sending data from database.
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => res.json(data));
});
// Signin
// Getting data from database and compare it with the data which
// we got from frontend if it matches then signin otherwise not
app.post("/signin", signIn.handleSignIn(db, bcrypt));
//Register
// Getting data from frontend and inserting it to the database if data
// got inserted successfully then it got registered otherewise not
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
// profile/:userid
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
//image
//In this route will get id from frontend and find the user
//from database with the same id and increment the entries
//in database and finally return the entries to frontend
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/test", (req, res) => {
  test.handleTest(req, res);
});

app.put("",(req,res) => {
  console.log("Welcome Home")
});

//We get the url from frontend and give it to the clarifai api
//to give the in (image.js) it will return the dimensions of
//face and will send it to the frontend
app.post("/imageUrl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/* Plan
 / --> res = It's working
 / signin --> Post = succes/fail
 / register --> Post = user
 / profile/:userid --> Get = user
 / image --> Put = user
*/
