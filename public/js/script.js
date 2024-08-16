let video;
let facemesh;
let modelIsReady = false;
let detections = [];
let faceIsDetected = false;
let faceImage;
let face;
let frameCounter = 0;
let detectionPerFrames = 10;

function preload() {
  facemesh = ml5.faceMesh({ maxFaces: 1 }, modelReady);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function modelReady() {
  console.log("Face Mesh model ready!");
  modelIsReady = true;
}

function draw() {
  background(220);

  if (modelIsReady) {
    if (frameCounter % detectionPerFrames === 0) {
      facemesh.detect(video, gotFaces);
    }
  }

  image(video, 0, 0);

  if (faceIsDetected) {
    face = detections[0];
    let box = face.box;
    noFill();
    stroke(255, 0, 0);
    rect(box.xMin, box.yMin, box.width, box.height);
  }
  frameCounter++;
}

function gotFaces(results) {
  detections = results;
  faceIsDetected = detections.length > 0;
}

function keyPressed() {
  if (keyCode === ENTER && faceIsDetected) {
    let box = face.box;
    captureFace(box.xMin, box.yMin, box.width, box.height);
  }
}

function captureFace(x, y, w, h) {
  // Create a snapshot of the entire video
  let snapshot = video.get();

  // Constrain the bounding box within the video dimensions
  x = constrain(x, 0, video.width - 1);
  y = constrain(y, 0, video.height - 1);
  w = constrain(w, 0, video.width - x);
  h = constrain(h, 0, video.height - y);

  // Crop the face image from the snapshot using the bounding box
  faceImage = snapshot.get(x, y, w, h);
}
