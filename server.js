// Importing required modules
const express = require("express"); // Express framework for building web applications
// const mongoose = require('mongoose'); // Mongoose library for interacting with MongoDB database
// const faceModel = require("./faceModel"); // Face model schema
const app = express(); // Creating an instance of Express app
const fileuploadMiddleWare = require("express-fileupload"); // Middleware for handling file uploads
const port = process.env.PORT || 3000; // Setting the port number for the application
const fs = require("fs"); // Node.js file system module for file operations

const socketIO = require("socket.io");

// const {
//     SerialPort,
//     ReadlineParser
// } = require('serialport');
// const Readline = require('@serialport/parser-readline');

// database info
// const username = "juniorvigneault";
// const password = "gFn78p58UL7oE6Yo";
// const cluster = "faces.5ak7ogt";
// const dbname = "Faces";

let imagePath;

//controller server to communicate with microcontroller
// const controllerPort = new SerialPort({
//     path: '/dev/tty.usbmodem14201',
//     baudRate: 9600
// });

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

// create a socket io server and attach it to the running server
// this allows the server to receive and emit events through
// socket.io library
const io = socketIO(server);

// const parser = new ReadlineParser();

// controllerPort.pipe(parser);

// parsing data on different lines
// parser.on("data", function (incoming) {
//   console.log(incoming.trim());
//   io.emit("controllerData", incoming.trim());
// });

// connect with mongo
app.use(fileuploadMiddleWare());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(express.static("public"));
app.use(express.static(__dirname + "/node_modules"));

// mongoose.connect(
//   `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
// );

// checking to see if connection with database is successful
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

app.post("/upload", async (req, res) => {
  let dataURL = req.body.image;
  let regex = /^data:.+\/(.+);base64,(.*)$/;
  let matches = dataURL.match(regex);
  let ext = matches[1];
  let data = matches[2];
  let buffer = Buffer.from(data, "base64");

  let getDate = new Date().toDateString();
  let getTime = new Date().toLocaleTimeString();

  let timeStamp = `${getDate.replace(/\s/g, "_")}_${getTime.replace(
    /:/g,
    "_"
  )}`;
  imagePath = `./public/assets/images/faces/${timeStamp}.`;
  fs.writeFileSync(imagePath + ext, buffer);
  // send the image path in the response
  res.send({
    imagePath,
  });
});

app.post("/uploadFaceState", async (req, res) => {
  try {
    // Parse the JSON data from the request body
    const faceState = JSON.parse(req.body.faceState);

    // Insert the faces into the database using the faceModel schema
    await faceModel.insertMany(faceState);

    res.send("Faces saved to database!");
  } catch (error) {
    res.status(500).send(error);
  }
});
