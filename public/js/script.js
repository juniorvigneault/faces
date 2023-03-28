// matter.js aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint;

// matter.js
let engine,
    world,
    mouseConstraint;

let ground;
// test rectangle particle 
let testParticles = [];

// all the walls and ground
let walls = [];
// ground bottom of the screen
let groundOptions = {
    x: 320,
    y: 520,
    w: 600,
    h: 100,
    options: {
        isStatic: true
    }
};
// ground bottom of the screen
let leftWallOptions = {
    x: 0,
    y: 300,
    w: 100,
    h: 500,
    options: {
        isStatic: true
    }
};
// ground bottom of the screen
let rightWallOptions = {
    x: 680,
    y: 300,
    w: 100,
    h: 500,
    options: {
        isStatic: true
    }
};


// face coordinates
let faceVertices = [];

// ml5 facemesh and detections 
let facemesh;
let detections = [];
let faceIsDetected = false;
let faceTopLeft = {
    x: undefined,
    y: undefined
}
let faceBottomRight = {
    x: undefined,
    y: undefined
}

let boundingBoxWidth;
let boundingBoxHeight;
// detect only 1 face at a time

let options = {
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
let faces = [];
let boundingCroppedFace;

// save face image to server
let formData;
let imagePath;

// polygon for pixel collision detection
let poly = [];

// create 2 canvases
let faceCanvas = function(fc){
    fc.setup = function(){
    fc.createCanvas(200, 200);
    }
    fc.draw = function(){
        fc.background(255,0,0)
    }
}
let myp5 = new p5(faceCanvas);
// setting up p5 canvas, matter.js engine, facemesh with ml5 and
// video capture
function setup() {
    createCanvas(canvas.width, canvas.height);
    engine = Engine.create();
    world = engine.world;
    runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create a mouse constraint
    mouseConstraint = MouseConstraint.create(engine);
    // Add the mouse constraint to the world
    World.add(world, mouseConstraint);

    World.add(world, mouseConstraint);
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
    boudingCroppedFace = createImage();
    // add a ground at the bottom of the canvas

    walls.push(ground = Bodies.rectangle(groundOptions.x, groundOptions.y, groundOptions.w, groundOptions.h, groundOptions.options));
    walls.push(leftWall = Bodies.rectangle(leftWallOptions.x, leftWallOptions.y, leftWallOptions.w, leftWallOptions.h, leftWallOptions.options));
    walls.push(rightWall = Bodies.rectangle(rightWallOptions.x, rightWallOptions.y, rightWallOptions.w, rightWallOptions.h, rightWallOptions.options));

    World.add(world, ground);
    World.add(world, leftWall);
    World.add(world, rightWall);


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
        faceIsDetected = true;
    });


}

function getKeypoints() {
    // get all detected faces (only one is possible now)
    for (let i = 0; i < detections.length; i++) {
        // get the keypoints of the silhouette of each face
        const faceKeypoints = detections[i].annotations.silhouette;
        // find the top and bottom coordinates of the face to find center
        // top left bounding box
        faceTopLeft.x = detections[i].boundingBox.topLeft[0][0];
        faceTopLeft.y = detections[i].boundingBox.topLeft[0][1];
        // bottom right bounding box
        faceBottomRight.x = detections[i].boundingBox.bottomRight[0][0];
        faceBottomRight.y = detections[i].boundingBox.bottomRight[0][1];
        // create polygon around the face
        createFacePoly(faceKeypoints);
        // draw small green circles at every coordinate of the silhouette 
        // for each detected faces 
        for (let j = 0; j < faceKeypoints.length; j++) {
            const [x, y] = faceKeypoints[j];
            drawfaceKeypoints(x, y);
        }
    }
    boundingBoxWidth = (faceBottomRight.x - faceTopLeft.x);
    boundingBoxHeight = (faceBottomRight.y - faceTopLeft.y);
    boundingCroppedFace = croppedFace.get(faceTopLeft.x, faceTopLeft.y, boundingBoxWidth, boundingBoxHeight);
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
async function cutout() {
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



    // copy(croppedFace, faceTopLeft.x, faceTopLeft.y, sw, sh, dx, dy, dw, dh)
    boundingBoxWidth = (faceBottomRight.x - faceTopLeft.x);
    boundingBoxHeight = (faceBottomRight.y - faceTopLeft.y);
    boundingCroppedFace = croppedFace.get(faceTopLeft.x, faceTopLeft.y, boundingBoxWidth, boundingBoxHeight);


    let mx = (faceBottomRight.x - faceTopLeft.x) / 2;
    let my = (faceBottomRight.y - faceTopLeft.y) / 2;

    faces.push(new Face(mx, my, poly, boundingCroppedFace));
    imagePath = await saveFaceImage(boundingCroppedFace);
    faces[faces.length - 1].setImageUrl(imagePath);
    console.log(faces);
    faceCutOut = true;
}

function display() {
    // grey background 
    background(0, 250, 0);
    // if the face is not cropped, display live video feed 
    // with green keypoints and line around the face
    if (faceCutOut === false) {
        // get all the keypoints around each faces (silhouettes)
        // draw all the keypoints with green dots
        image(video, 0, 0, canvas.width, canvas.height)
        getKeypoints();

        // if face is cropped, display only the cropped image 
    } else if (faceCutOut === true) {
        displayFaces();
    };

    // display ground at the bottom of canvas
    displayGround();
    displayTestParticles();

};

function displayGround() {
    push();
    rectMode(CENTER);
    fill(250);
    noStroke();
    rect(groundOptions.x, groundOptions.y, groundOptions.w, groundOptions.h)
    pop();
}

function displayFaces() {
    for (let i = 0; i < faces.length; i++) {
        faces[i].display();
    };

    // image(boudingCroppedFace, 0,0);
};

function displayTestParticles() {
    for (let i = 0; i < testParticles.length; i++) {
        testParticles[i].display();
    }
}
// when clicking, snapshot is taken and processed into 
// a cropped cut out around the face
function mouseDragged() {
    // testParticles.push(new Box(mouseX, mouseY, 20, 20));
};

function keyPressed() {
    // pressing space switches back to video live feed 
    if (keyCode === 32) {
        faceCutOut = false
    }
    // pressing enter cut outs face and adds it to the canvas
    // also saves image to the server
    if (keyCode === 13) {
        if (faceIsDetected) {
            // take a frame from video feed on click
            snapshot = video.get();
            // cut out the face in the snapshot
            cutout();
        };
    }
    // pressing "q" saves the faces data and sends it to 
    // database
    if (keyCode === 81) {
        saveState(faces);
    }
}

// function to save images of face on server in assets folder
function saveFaceImage(faceImage) {
    return new Promise((resolve, reject) => {
        // get image 
        let canvasImage = faceImage.canvas;
        let imageFile = canvasImage.toDataURL('image/png', '');
        //   create formData
        formData = new FormData();

        // append image to form
        formData.append('image', imageFile);

        // Send the FormData object to the server using a POST request
        // Get the image path from the server response
        fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                console.log('Image path:', data.imagePath); // Access the image path from the response object
                resolve(data.imagePath);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    })
};

function saveState(faces) {
    // Send the FormData object to the server using a POST request
    // create an array to store the state of each face
    const faceState = [];
    // loop through each face and add store each property i need to keep in the database
    // in variables
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        const x = face.pos.x;
        const y = face.pos.y;
        const angle = face.angle;
        const vertices = face.vertices;
        const imagePath = `${face.imagePath}png`; // adding the extension png (automatic when saving file on server (already has a dot at the end))
        // push all the properties of each image in a faceState array 
        faceState.push({
            index: i,
            x: x,
            y: y,
            angle: angle,
            vertices: vertices.map(vertex => ({
                x: vertex.x,
                y: vertex.y
            })),
            imagePath: imagePath
        });
    };
    console.log(faces);
    // stringify the facesState array
    const jsonString = JSON.stringify(faceState);

    // create a new FormData object and append the faceState data of each face
    const data = new FormData();
    data.append('faceState', jsonString);

    // Post the data to the server 
    fetch('/uploadFaceState', {
            method: 'POST',
            body: data
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
};