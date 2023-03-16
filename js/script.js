// matter.js aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner;

// matter.js
let engine,
    world;

// matter.js test box 
let box;

// face coordinates
let faceVertices = [];

// ml5 facemesh and detections 
let facemesh;
let detections = [];
let modelIsReady = false;
// detect only 1 face at a time
const options = {
    maxFaces: 1,
}

// video and canvas 
let video;
let canvas = {
    width: 640,
    height: 480,
}

// images
let snapshot;
let croppedFace;
let faceCutOut = false;

// polygon for pixel collision detection
let poly = [];

// setting up p5 canvas, matter.js engine, facemesh with ml5 and
// video capture
function setup() {
    createCanvas(canvas.width, canvas.height);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    // test box falling at start of programm 
    box = new Box(200, 200, 200, 200);

    // Set up the live camera feed
    video = createCapture(VIDEO);
    video.size(canvas.width, canvas.height);
    video.hide();

    // load facemesh faces using the video input 
    // run modelReady when initialized
    facemesh = ml5.facemesh(video, options, modelReady);

    // create new image to later store the snapshot in
    snapshot = createImage(canvas.width, canvas.height);
    // stores the cropped face from the snapshot after processing
    croppedFace = createImage(canvas.width, canvas.height);
}

// grey background on canvas, display particles in faces array
function draw() {
    display();
}


// When facemesh is loaded, log "model is ready" and 
// and start detecting faces
function modelReady() {
    modelIsReady = true;
    console.log('Face Mesh model ready!');
    // check for faces
    facemesh.on('face', results => {
        detections = results;
    });

}

async function getKeypoints() {
    // get the silhoutte of all the detected faces
    for (let i = 0; i < detections.length; i++) {
        const faceKeypoints = detections[i].annotations.silhouette;

        createFacePoly(faceKeypoints);

        // draw small green circles at every coordinate of the silhouette 
        // for each detected faces 
        for (let j = 0; j < faceKeypoints.length; j++) {
            const [x, y] = faceKeypoints[j];
            drawfaceKeypoints(x, y);
        }
    }
}
// draw the green dots on all keypoints
function drawfaceKeypoints(x, y) {
    push();
    fill(0, 255, 0);
    ellipse(x, y, 5, 5);
    pop();
}
// create a poly around the face based on the keypoints 
// of the facemesh to isolate the pixels inside.
function createFacePoly(faceKeypoints) {
    poly = Array(faceKeypoints.length).fill();
    for (let j = 0; j < faceKeypoints.length; j++) {
        const [x, y] = faceKeypoints[j];
        poly[j] = createVector(x, y);
    }
    // create a mask around the face based on the vectors
    // of the poly
    push();
    noFill();
    beginShape();
    for (let i = 0; i < poly.length; i++) {
        vertex(poly[i].x, poly[i].y);
    }
    endShape(CLOSE);
    pop();
}

// cut out the face in the snapshot 
function cutout() {
    // initialize array of pixels from the video frame snapshot
    snapshot.loadPixels();
    croppedFace.loadPixels();
    // for every pixel in the snapshot for the video feed
    for (let y = 0; y < snapshot.height; y++) {
        for (let x = 0; x < snapshot.width; x++) {
            // check if the pixels are inside the polygon of the face
            if (collidePointPoly(x, y, poly) === true) {
                // if they do collide, get the pixel from the snapshot 
                let p = snapshot.get(x, y);
                // and set it to the correct RGB color in the new cropped 
                // face image
                croppedFace.set(x, y, color(red(p), green(p), blue(p)));
                // if the pixel is outside the poly (doesn't collide)
            } else {
                //set the pixel to be transparent
                let transparentPixel = color(red(0), green(0), blue(0));
                transparentPixel.setAlpha(0);
                // set the transparent pixel in the cropped face image
                croppedFace.set(x, y, transparentPixel);
            };
        };
    };
    // update the set pixels of the cropped face
    croppedFace.updatePixels();
    // face is now cut out, display the cropped face
    faceCutOut = true;
}

function display() {
    // grey background 
    background(220, 200, 210);

    // if the face is not cropped, display live video feed 
    // with green keypoints and line around the face
    if (faceCutOut === false) {
        // get all the keypoints around each faces (silhouettes)
        // draw all the keypoints with green dots
        image(video, 0, 0, canvas.width, canvas.height)
        getKeypoints();
// if face is cropped, display only the cropped image 
    } else if (faceCutOut === true) {
        // display cropped face
        image(croppedFace, 0, 0);
    };
    // display matter.js test box at the start of application
    box.display();
};

// when clicking, snapshot is taken and processed into 
// a cropped cut out around the face
function mousePressed() {
    if (modelIsReady) {
        // take a frame from video feed on click
        snapshot = video.get();
        // cut out the face in the snapshot
        cutout();
    };
};

// if pressing space, the live video feed starts again
function keyPressed(){
 if (keyCode === 32) {
     faceCutOut = false
 }
 }