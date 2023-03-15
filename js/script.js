// matter.js aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner;

// matter.js variables
let engine,
    world;

// make a box to test the engine 
let box;

// faces array to store all the faces screenshots
let faces = [];

// face api and detections 
let faceAPI;
let detections = [];

// video and canvas 
let video;
let canvas;



function preload() {}


function setup() {
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    // test box
    faces.push(new Box(200, 200, 200, 200));

    // Set up the camera 
    video = createCapture(VIDEO);
    video.size(width, height);

    // Start detecting faces
    faceAPI = ml5.faceApi(video, 'faceLandmarks', modelReady);

}

function draw() {
    // grey background 
    background(100, 100, 100);
    // display test box at the start of application
    for (let i = 0; i < faces.length; i++) {
        faces[i].display();
    }

}

function gotResults(err, result) {
    if (err) {
        console.log(err);
    }
    // Store the face detections
    detections = result;
    // Continue detecting faces
    faceAPI.detect(gotResults);
}

// face api model is ready
function modelReady() {
    console.log('Face API model ready!');
    faceAPI.detect(gotResults);
}