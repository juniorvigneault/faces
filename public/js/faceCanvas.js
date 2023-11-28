// create 2 canvases
let breakFace;
let newImage = null;
let faceCanvas = function (fc) {
    // matter.js aliases
    let Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Runner = Matter.Runner,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse

    // matter.js
    let engine,
        world,
        mouseConstraint,
        mouse
    let tank;
    let onVerticalScreen = false;

    // boundaries static matter js bodies bottom, left and right
    let ground, leftWall, rightWall, extraTestWall;
    // walls and floor
    let boundaries = [];
    // Conveyors
    let conveyors = []
    let conveyor1 = {
        x: 350,
        y: 300,
        w: 700,
        h: 50,
        angle: 0
    }
    // Function to initialize conveyor pins
    function initializeConveyorPin(x, y) {
        return {
            x,
            y: y - 30,
            speed: 0,
            over: true,
            under: false
        };
    }
    // speed going back to positive
    let speed = .5;
    // pin going down
    let pinHeight = 50;
    // pin going up
    let pinUp = 30;
    // Initialize conveyor pins
    // Number of conveyor pins
    let numberOfPins = 8;
    let timeBetweenPins = 6000;
    let faceParticles = [];

    // Initialize conveyor pins
    let conveyorPins = Array.from({
            length: numberOfPins
        }, () =>
        initializeConveyorPin(conveyor1.x - conveyor1.w / 2, conveyor1.y)
    );

    setTimeout(() => {
        updateSpeedsWithDelay(timeBetweenPins, .5);
    }, 10000)

    extraTestWall = 10;

    let boundaryGround = {
        x: 200,
        y: faceCanvasDimensions.height - extraTestWall,
        // make sure the length of ground covers width of canvas
        w: faceCanvasDimensions.width * 2,
        h: 50,
        angle: 0
    };
    // 
    let boundaryLeftWall = {
        x: extraTestWall,
        y: 200,
        w: 50,
        // make sure the height of wall covers height of canvas
        h: faceCanvasDimensions.height * 2,
        angle: 0
    };

    let boundaryRightWall = {
        x: faceCanvasDimensions.width - extraTestWall,
        y: 200,
        w: 50,
        // make sure the height of wall covers height of canvas
        h: faceCanvasDimensions.height * 2,
        angle: 0
    };

    let particleTest;

    let backgroundColor = 255;
    // setup function of face canvas 
    fc.setup = function () {
        let cnv = fc.createCanvas(faceCanvasDimensions.width, faceCanvasDimensions.height);
        cnv.parent('parent');
        let parentElement = document.getElementById('parent');
        // rotate canvas for vertical tv
        // parentElement.style.transform = 'rotate(270deg)'
        engine = Engine.create();
        world = engine.world;
        runner = Runner.create();
        Matter.Runner.run(runner, engine);
        mouse = Mouse.create(parentElement),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse
            });
        // Add the mouse constraint to the world
        World.add(world, mouseConstraint);
        // create physical bounderies around the canvas to hold faces
        createBoundaries();

        createConveyor(fc);


        tank = new Tank(world)
    };

    // draw function of face canvas
    fc.draw = function () {
        if (onVerticalScreen) {
            fc.push();
            fc.translate(fc.width / 2, fc.height / 2);

            fc.rotate(fc.radians(90));
            fc.translate(-fc.width / 2, -fc.height / 2);
        }
        fc.background(0);
        display();
        flash();
        if (onVerticalScreen) {
            fc.pop();
        }

        tank.update(fc)


        for (let i = 0; i < faces.length; i++) {

            let d = fc.dist(faces[i].body.position.x, faces[i].body.position.y, tank.midpoint.x, tank.midpoint.y);
            if (faces[i].isChopped == false && d <= 100) {
                breakFace();
                faces[i].isChopped = true;
                faces[i].removeFromWorld(world);
            }
        }
    };

    breakFace = () => {
        console.log('clicked');

        for (let i = 0; i < faces.length; i++) {
            let currentFace = faces[0].image;
            let squareSize = 50; // Adjust this based on your desired square size
            let cols = currentFace.width / squareSize;
            let rows = currentFace.height / squareSize;
            //let numPixelsToAccess = squareSize * squareSize * 4;


            currentFace.loadPixels();
            // console.log(currentFace.pixels.length)
            // for (m = 0; m < currentFace.pixels.length; m += 4) {
            //     currentFace.pixels[m] = 255
            //     currentFace.pixels[m + 1] = 255
            //     currentFace.pixels[m + 2] = 255
            //     currentFace.pixels[m + 3] = 255
            // }
            // currentFace.updatePixels();

            //for (let cIndex = 0; cIndex < currentFace.pixels.length; cIndex += numPixelsToAccess) {
            //let cIndex = 0;
            //while (cIndex < (4 * squareSize * squareSize)) {
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    let startX = x * squareSize;
                    let startY = y * squareSize;
                    let faceIndex = (startX * 4) + (startY * 4) * parseInt(currentFace.width);
                    newImage = fc.createImage(squareSize, squareSize);

                    // Copy pixels from the original image to the new image
                    newImage.loadPixels();

                    let numPixels = 4 * squareSize * squareSize;
                    let counter = 0;

                    for (let k = 0; k < numPixels; k += 4) {
                        if ((k % (squareSize * 4)) === 0 && k !== 0) {
                            //faceIndex = startX + (startY + counter) * currentFace.pixels.length * 4;
                            faceIndex = (faceIndex + parseInt(currentFace.width) * 4) - (squareSize * 4);
                        }
                        newImage.pixels[k] = currentFace.pixels[faceIndex];
                        newImage.pixels[k + 1] = currentFace.pixels[faceIndex + 1];
                        newImage.pixels[k + 2] = currentFace.pixels[faceIndex + 2];
                        newImage.pixels[k + 3] = currentFace.pixels[faceIndex + 3];

                        faceIndex += 4;

                    }
                    newImage.updatePixels();


                    //     // Create a new FaceParts instance for each square
                    console.log(startX, startY);
                    faceParticles.push(new FaceParts(startX + faces[i].body.position.x, startY + faces[i].body.position.y, squareSize, squareSize, 0, newImage, world));
                }
            }
        }
    }



    function display() {
        fc.background(backgroundColor);
        // display ground at the bottom of canvas

        // Move conveyor pins
        conveyorPins.forEach((pin, index) => {
            movePinOnConveyor(pin, conveyor1, speed, pinHeight, conveyors[0].conveyorPins[index].body);
        });

        // console.log(conveyors[0].conveyorPins[0])
        for (let i = 0; i < boundaries.length; i++) {
            boundaries[i].display(fc);
        }

        for (let i = 0; i < conveyors.length; i++) {
            conveyors[i].display(fc);
        }

        for (let i = 0; i < faces.length; i++) {
            if (faces[i].isCreated === false) {
                faces[i].setup(world);
            } else if (!faces[i].isChopped) {
                faces[i].display(fc);
            }
        }
        for (let i = 0; i < faceParticles.length; i++) {
            faceParticles[i].display(fc);
        }


        // if (newImage !== null) {
        //     fc.push();
        //     fc.image(newImage, 200, 200);
        //     fc.pop();
        // }
    };

    // Function to update speed with a delay
    function updateSpeedsWithDelay(delay, desiredSpeed) {
        for (let i = 0; i < conveyorPins.length; i++) {
            setTimeout(() => {
                // Update speed for the specific pin
                conveyorPins[i].speed = desiredSpeed;
            }, i * delay);
        }
    }

    function movePinOnConveyor(pin, conveyor, speed, dropAmount, arr) {
        let conveyorStart = conveyor.x - conveyor.w / 2 + 10;
        let lengthOfConveyor = conveyorStart + conveyor.w - 20;

        if (pin.x >= lengthOfConveyor && pin.over) {
            // Bring down the pin
            pin.y = constrain(pin.y, conveyor.y, conveyor.y + dropAmount);
            pin.y += speed;

            // Move pin in the opposite direction
            pin.speed = -pin.speed;
            pin.over = false;
        }

        if (pin.x <= conveyorStart && !pin.over) {
            pin.y -= pinUp;
            pin.speed = speed;
            pin.over = true;
        }

        pin.x = constrain(pin.x, conveyorStart, lengthOfConveyor);
        pin.x += pin.speed;

        Matter.Body.setPosition(arr, {
            x: pin.x,
            y: pin.y
        });
    }

    function flash() {
        if (isFlashing) {
            fc.noStroke();
            fc.push();
            fc.fill(flashColor);
            fc.rectMode(CENTER);
            fc.rect(fc.width / 2, fc.height / 2, fc.width, fc.height);
            fc.pop();
        }
    }

    function displayTestParticle() {
        fc.push();
        let pos = particleTest.position;
        let angle = particleTest.angle;
        fc.translate(pos.x, pos.y)
        fc.rotate(angle);
        fc.rectMode(CENTER);
        fc.rect(0, 0, 100, 100);
        fc.pop();
    }

    function createConveyor(fc) {
        conveyor1 = new Conveyor(conveyor1.x, conveyor1.y, conveyor1.w, conveyor1.h, conveyor1.angle, world, fc, numberOfPins);
        conveyors.push(conveyor1);
    }

    function createBoundaries() {
        // push boundaries to the edge of canvas so they are invisible
        adjustBoundaryPosition();
        // create boundaries around the canvas 
        ground = new Boundary(boundaryGround.x, boundaryGround.y, boundaryGround.w, boundaryGround.h, boundaryGround.angle, world);
        leftWall = new Boundary(boundaryLeftWall.x, boundaryLeftWall.y, boundaryLeftWall.w, boundaryLeftWall.h, boundaryLeftWall.angle, world);
        rightWall = new Boundary(boundaryRightWall.x, boundaryRightWall.y, boundaryRightWall.w, boundaryRightWall.h, boundaryRightWall.angle, world);
        boundaries.push(ground, leftWall, rightWall);
    };

    function adjustBoundaryPosition() {
        boundaryGround.y = boundaryGround.y + boundaryGround.h / 2;
        boundaryLeftWall.x = boundaryLeftWall.x - boundaryLeftWall.w / 2;
        boundaryRightWall.x = boundaryRightWall.x + boundaryRightWall.w / 2;
    };


};



let myp5 = new p5(faceCanvas);