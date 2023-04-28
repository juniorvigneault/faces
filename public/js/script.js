// face coordinates
let faceVertices = [];

// ml5 facemesh and detections 
let facemesh;
let detections = [];
let faceIsDetected = false;
let faceTopLeft = {
    x: null,
    y: null
}
let faceBottomRight = {
    x: null,
    y: null
}
let boundingBoxWidth;
let boundingBoxHeight;
// detect only 1 face at a time

let options = {
    maxFaces: 1,
};

// video and canvas 
let video;
let canvas = {
    width: 640,
    height: 480,
}

// images
let snapshot;
let faceImage;
let faces = [];
let croppedFaceImage;

let faceCanvasDimensions = {
    width: 1920,
    height: 1080
}

let facePosition = {
    x: faceCanvasDimensions.width / 2,
    y: -100
}

// save face image to server
let formData;
let imagePath;

let isFlashing;
let flashTime = 50;
let flashColor = 255;
// let flashGradient = 50;
let flashTrigger = 1000;
let pictureTrigger = 50;

// polygon for pixel collision detection
let poly = [];

let videCanvas;

let controllerData = false;
let connectedToSocket = false;
// setting up p5 canvas, matter.js engine, facemesh with ml5 and
// video capture
function setup() {
    // create first canvas for the video capture and facemesh 
    videoCanvas = createCanvas(canvas.width, canvas.height);
    videoCanvas.hide();

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
    faceImage = createImage(canvas.width, canvas.height);


    // connect to server 
    connectedToSocket = false;
    controllerData = false;

    let ioSocket = io();

    let clientSocket = ioSocket.connect('http://localhost:3001')
    clientSocket.on('connect', function (data) {
        console.log("connected");
        connected = true;

        clientSocket.on('controllerData', (data) => {
            controllerData = data;
            console.log(controllerData);
            if (faceIsDetected && controllerData === 'true') {
                createNewFace(flashTrigger);
            }
        });
    });
}

//run video feed and draw keypoints on face silhouette
function draw() {
    background(0, 250, 0);

    // display video feed on canvas
    image(video, 0, 0, canvas.width, canvas.height)

    // get all the keypoints around face
    createFacePoly();

    // draw small green circles at every coordinate of the silhouette 
    // with line connecting 
    displayFaceKeypoints(poly);
    // crop image around the poly 
    cropFaceImage();
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
// get points around the silhouette of face 
// create a poly around the face based on the keypoints 
function createFacePoly() {
    // get all detected faces (only one is possible now)
    for (let i = 0; i < detections.length; i++) {
        // get the keypoints of the silhouette of each face
        const faceKeypoints = detections[i].annotations.silhouette;

        // create polygon around the face
        poly = Array(faceKeypoints.length).fill();
        for (let j = 0; j < faceKeypoints.length; j++) {
            const [x, y] = faceKeypoints[j];
            poly[j] = createVector(x, y);
        }
    }
}

function cropFaceImage() {
    for (let i = 0; i < detections.length; i++) {
        // find the top and bottom coordinates of the face to find center
        // top left bounding box
        faceTopLeft.x = detections[i].boundingBox.topLeft[0][0];
        faceTopLeft.y = detections[i].boundingBox.topLeft[0][1];
        // bottom right bounding box
        faceBottomRight.x = detections[i].boundingBox.bottomRight[0][0];
        faceBottomRight.y = detections[i].boundingBox.bottomRight[0][1];
    }
    boundingBoxWidth = (faceBottomRight.x - faceTopLeft.x);
    boundingBoxHeight = (faceBottomRight.y - faceTopLeft.y);
    croppedFaceImage = faceImage.get(faceTopLeft.x, faceTopLeft.y, boundingBoxWidth, boundingBoxHeight);
}

// cut out the face in the snapshot 
async function cutout() {
    // initialize array of pixels from the video frame snapshot
    snapshot.loadPixels();
    faceImage.loadPixels();
    // for every pixel in the snapshot for the video feed
    for (let y = 0; y < snapshot.height; y++) {
        for (let x = 0; x < snapshot.width; x++) {
            // check if the pixels are inside the polygon of the face
            if (collidePointPoly(x, y, poly) === true) {
                // if they do collide, get the pixel from the snapshot 
                let p = snapshot.get(x, y);
                // and set it to the correct RGB color in the new cropped 
                // face image
                faceImage.set(x, y, color(red(p), green(p), blue(p)));
                // if the pixel is outside the poly (doesn't collide)
            } else {
                //set the pixel to be transparent
                let transparentPixel = color(red(0), green(0), blue(0));
                transparentPixel.setAlpha(0);
                // set the transparent pixel in the cropped face image
                faceImage.set(x, y, transparentPixel);
            };
        };
    };
    // update the set pixels of the cropped face
    faceImage.updatePixels();

    boundingBoxWidth = (faceBottomRight.x - faceTopLeft.x);
    boundingBoxHeight = (faceBottomRight.y - faceTopLeft.y);
    croppedFaceImage = faceImage.get(faceTopLeft.x, faceTopLeft.y, boundingBoxWidth, boundingBoxHeight);

    faces.push(new Face(facePosition.x, facePosition.y, poly, croppedFaceImage));
    // imagePath = await saveFaceImage();
    // faces[faces.length - 1].setImageUrl(imagePath);
}

function keyPressed() {
    // pressing enter cut outs face and adds it to the canvas
    // also saves image to the server
    if (keyCode === 13) {
        if (faceIsDetected) {
            // trigger flash after 3 seconds 
            setTimeout(() => {
                // isFlashing = true;
                console.log('FLASH ON');
                setTimeout(() => {
                    // take a frame from video feed on click
                    snapshot = video.get();
                    // cut out the face in the snapshot
                    cutout();
                    console.log('PICTURE TAKEN');
                    setTimeout(() => {
                        // isFlashing = false;
                        console.log('FLASH OFF');
                    }, flashTime);
                }, pictureTrigger);
            }, flashTrigger)
        };
    }
    // pressing "q" saves the faces data and sends it to 
    // database
    if (keyCode === 81) {
        saveState(faces);
    }
}



function displayFaceKeypoints() {
    push();
    noFill();
    beginShape();
    // creating line around face
    for (let i = 0; i < poly.length; i++) {
        vertex(poly[i].x, poly[i].y);
    }
    endShape(CLOSE);
    pop();
    // creating green dots around face
    for (let i = 0; i < poly.length; i++) {
        push();
        fill(0, 255, 0);
        ellipse(poly[i].x, poly[i].y, 5, 5);
        pop();
    }
}

function createNewFace(flashTrigger) {
    // trigger flash after 3 seconds 
    setTimeout(() => {
        // isFlashing = true;
        console.log('FLASH ON');
        setTimeout(() => {
            // take a frame from video feed on click
            snapshot = video.get();
            // cut out the face in the snapshot
            cutout();
            console.log('PICTURE TAKEN');
            setTimeout(() => {
                // isFlashing = false;
                console.log('FLASH OFF');
            }, flashTime);
        }, pictureTrigger);
    }, flashTrigger)
};

// function to save images of face on server in assets folder
function saveFaceImage() {
    return new Promise((resolve, reject) => {
        // get canvas of image and create a file with it
        let canvasImage = croppedFaceImage.canvas;
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
                // Access the image path from the response object
                console.log('Image Saved to server! Image path: ', data.imagePath)
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