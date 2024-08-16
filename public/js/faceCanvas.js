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
    Mouse = Matter.Mouse;
  let createParticle = false;
  // matter.js
  let engine, world, mouseConstraint, mouse;

  //   let onVerticalScreen = true;
  // boundaries static matter js bodies bottom, left and right
  let ground, leftWall, rightWall, extraTestWall;
  // walls and floor
  let boundaries = [];
  // Conveyors
  //   let conveyors = [];
  //   let conveyor1 = {
  //     x: 800,
  //     y: -150,
  //     w: 800,
  //     h: 50,
  //     angle: 0,
  //   };
  // Function to initialize conveyor pins
  //   function initializeConveyorPin(x, y) {
  //     return {
  //       x,
  //       y: y - 30,
  //       speed: 0,
  //       over: true,
  //       under: false,
  //     };
  //   }
  // speed going back to positive
  //   let speed = 0.5;
  // pin going down
  //   let pinHeight = 50;
  // pin going up
  //   let pinUp = 30;
  let faceCanvasDimensions = {
    width: 1280,
    height: 920,
  };
  // Initialize conveyor pins
  // Number of conveyor pins
  //   let numberOfPins = 8;
  //   let timeBetweenPins = 6000;
  let faceParticles = [];
  let particles = [];
  // Initialize conveyor pins
  //   let conveyorPins = Array.from(
  //     {
  //       length: numberOfPins,
  //     },
  //     () => initializeConveyorPin(conveyor1.x - conveyor1.w / 2, conveyor1.y)
  //   );

  //   setTimeout(() => {
  //     updateSpeedsWithDelay(timeBetweenPins, 0.5);
  //   }, 10000);

  extraTestWall = 10;

  // GROUND WHEN VERTICAL
  let boundaryGround = {
    x: 1100,
    y: 1450,
    // make sure the length of ground covers width of canvas
    w: 900,
    h: 50,
    angle: 0,
  };
  // LEFT WALL WHEN VERTICAL
  //   let boundaryLeftWall = {
  //     x: 400,
  //     y: 200,
  //     w: 50,
  //     // make sure the height of wall covers height of canvas
  //     h: faceCanvasDimensions.height * 2,
  //     angle: 0,
  //   };
  //   // RIGHT WALL WHEN VERTICAL
  //   let boundaryRightWall = {
  //     x: 1500,
  //     y: 200,
  //     w: 50,
  //     // make sure the height of wall covers height of canvas
  //     h: faceCanvasDimensions.height * 2,
  //     angle: 0,
  //   };

  let particleTest;

  let backgroundColor;
  // setup function of face canvas
  fc.setup = function () {
    let cnv = fc.createCanvas(
      faceCanvasDimensions.width,
      faceCanvasDimensions.height,
      WEBGL
    );
    cnv.parent("parent");
    let parentElement = document.getElementById("parent");
    // rotate canvas for vertical tv
    // parentElement.style.transform = 'rotate(270deg)'
    engine = Engine.create();
    world = engine.world;
    runner = Runner.create();
    Matter.Runner.run(runner, engine);
    (mouse = Mouse.create(parentElement)),
      (mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      }));
    // Add the mouse constraint to the world
    World.add(world, mouseConstraint);
    // create physical bounderies around the canvas to hold faces
    createBoundaries();

    // createConveyor(fc);
  };

  // draw function of face canvas
  fc.draw = function () {
    // if (onVerticalScreen) {
    //   fc.push();
    //   fc.translate(fc.width / 2, fc.height / 2);

    //   fc.rotate(fc.radians(90));
    //   fc.translate(-fc.width / 2, -fc.height / 2);
    // }
    fc.background(0);
    display();
    if (faceImage) {
      fc.image(faceImage, 0, 0);
      if (createParticle === false) {
        let testParticle = new Particle(200, 200, 100, 100, world);
        particles.push(testParticle);
      }
    }
    for (particle of particles) {
      particle.display(fc);
    }
    // flash();

    // for (let i = 0; i < faces.length; i++) {
    //   let d = fc.dist(
    //     faces[i].body.position.x,
    //     faces[i].body.position.y,
    //     tank.midpoint.x,
    //     tank.midpoint.y
    //   );
    //   if (faces[i].isChopped == false && d <= 100) {
    //     setTimeout(() => {
    //       faces[i].hitline = true;
    //     }, 2000);
    //     if (faces[i].hitline === true) {
    //       console.log("hit!");
    //       breakFace();
    //       faces[i].removeFromWorld(world);
    //       faces[i].isChopped = true;
    //       hitline = false;
    //     }
    //   }
    // }

    // tank.update(fc);

    // if (onVerticalScreen) {
    //   fc.pop();
    // }
  };

  //   breakFace = () => {
  //     console.log("clicked");

  //     for (let i = 0; i < faces.length; i++) {
  //       let currentFace = faces[0].image;
  //       let squareSize = 50; // Adjust this based on your desired square size
  //       let cols = currentFace.width / squareSize;
  //       let rows = currentFace.height / squareSize;
  //       //let numPixelsToAccess = squareSize * squareSize * 4;

  //       currentFace.loadPixels();
  //       // console.log(currentFace.pixels.length)
  //       // for (m = 0; m < currentFace.pixels.length; m += 4) {
  //       //     currentFace.pixels[m] = 255
  //       //     currentFace.pixels[m + 1] = 255
  //       //     currentFace.pixels[m + 2] = 255
  //       //     currentFace.pixels[m + 3] = 255
  //       // }
  //       // currentFace.updatePixels();

  //       //for (let cIndex = 0; cIndex < currentFace.pixels.length; cIndex += numPixelsToAccess) {
  //       //let cIndex = 0;
  //       //while (cIndex < (4 * squareSize * squareSize)) {
  //       for (let x = 0; x < cols; x++) {
  //         for (let y = 0; y < rows; y++) {
  //           let startX = x * squareSize;
  //           let startY = y * squareSize;
  //           let faceIndex = startX * 4 + startY * 4 * parseInt(currentFace.width);
  //           newImage = fc.createImage(squareSize, squareSize);

  //           // Copy pixels from the original image to the new image
  //           newImage.loadPixels();

  //           let numPixels = 4 * squareSize * squareSize;
  //           let counter = 0;

  //           for (let k = 0; k < numPixels; k += 4) {
  //             if (k % (squareSize * 4) === 0 && k !== 0) {
  //               //faceIndex = startX + (startY + counter) * currentFace.pixels.length * 4;
  //               faceIndex =
  //                 faceIndex + parseInt(currentFace.width) * 4 - squareSize * 4;
  //             }
  //             newImage.pixels[k] = currentFace.pixels[faceIndex];
  //             newImage.pixels[k + 1] = currentFace.pixels[faceIndex + 1];
  //             newImage.pixels[k + 2] = currentFace.pixels[faceIndex + 2];
  //             newImage.pixels[k + 3] = currentFace.pixels[faceIndex + 3];

  //             faceIndex += 4;
  //           }
  //           newImage.updatePixels();

  //           //     // Create a new FaceParts instance for each square
  //           console.log(startX, startY);
  //           faceParticles.push(
  //             new FaceParts(
  //               startX + faces[i].body.position.x,
  //               startY + faces[i].body.position.y,
  //               squareSize,
  //               squareSize,
  //               0,
  //               newImage,
  //               world
  //             )
  //           );
  //         }
  //       }
  //     }
  //   };

  function display() {
    // fc.background(200, 210, 203);
    fc.background(245);

    // display ground at the bottom of canvas

    // Move conveyor pins
    // conveyorPins.forEach((pin, index) => {
    //   movePinOnConveyor(
    //     pin,
    //     conveyor1,
    //     speed,
    //     pinHeight,
    //     conveyors[0].conveyorPins[index].body
    //   );
    // });

    // console.log(conveyors[0].conveyorPins[0])
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].display(fc);
    }

    // for (let i = 0; i < conveyors.length; i++) {
    //   conveyors[i].display(fc);
    // }

    // for (let i = 0; i < faces.length; i++) {
    //   if (faces[i].isCreated === false) {
    //     faces[i].setup(world);
    //   } else if (!faces[i].isChopped) {
    //     faces[i].display(fc);
    //   }
    // }
    // for (let i = 0; i < faceParticles.length; i++) {
    //   faceParticles[i].display(fc);
    // }

    // if (newImage !== null) {
    //     fc.push();
    //     fc.image(newImage, 200, 200);
    //     fc.pop();
    // }
  }

  // Function to update speed with a delay
  //   function updateSpeedsWithDelay(delay, desiredSpeed) {
  //     for (let i = 0; i < conveyorPins.length; i++) {
  //       setTimeout(() => {
  //         // Update speed for the specific pin
  //         conveyorPins[i].speed = desiredSpeed;
  //       }, i * delay);
  //     }
  //   }

  //   function movePinOnConveyor(pin, conveyor, speed, dropAmount, arr) {
  //     let conveyorStart = conveyor.x - conveyor.w / 2 + 10;
  //     let lengthOfConveyor = conveyorStart + conveyor.w - 20;

  //     if (pin.x >= lengthOfConveyor && pin.over) {
  //       // Bring down the pin
  //       pin.y = constrain(pin.y, conveyor.y, conveyor.y + dropAmount);
  //       pin.y += speed;

  //       // Move pin in the opposite direction
  //       pin.speed = -pin.speed;
  //       pin.over = false;
  //     }

  //     if (pin.x <= conveyorStart && !pin.over) {
  //       pin.y -= pinUp;
  //       pin.speed = speed;
  //       pin.over = true;
  //     }

  //     pin.x = constrain(pin.x, conveyorStart, lengthOfConveyor);
  //     pin.x += pin.speed;

  //     Matter.Body.setPosition(arr, {
  //       x: pin.x,
  //       y: pin.y,
  //     });
  //   }

  //   function flash() {
  //     if (isFlashing) {
  //       fc.noStroke();
  //       fc.push();
  //       fc.fill(flashColor);
  //       fc.rectMode(CENTER);
  //       fc.rect(fc.width / 2, fc.height / 2, fc.width, fc.height);
  //       fc.pop();
  //     }
  //   }

  function renderClothWithImage(cloth, columns, rows) {
    // Set texture mode to make it consistent with 2D mode
    p.textureMode(p.NORMAL);

    // Apply texture to the cloth
    p.texture(img);
    p.translate(-p.width / 2, -p.height / 2);

    // Iterate over each cloth particle
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < columns - 1; x++) {
        let index = x + y * columns;
        let nextIndex = index + 1;
        let belowIndex = index + columns;
        let belowNextIndex = belowIndex + 1;

        // Calculate texture coordinates
        let u1 = x / (columns - 1);
        let v1 = y / (rows - 1);
        let u2 = (x + 1) / (columns - 1);
        let v2 = (y + 1) / (rows - 1);
        p.noStroke();
        // Draw the cloth square with texture
        p.beginShape(p.QUADS);
        p.texture(img);
        p.vertex(
          cloth.bodies[index].position.x,
          cloth.bodies[index].position.y,
          u1,
          v1
        );
        p.vertex(
          cloth.bodies[nextIndex].position.x,
          cloth.bodies[nextIndex].position.y,
          u2,
          v1
        );
        p.vertex(
          cloth.bodies[belowNextIndex].position.x,
          cloth.bodies[belowNextIndex].position.y,
          u2,
          v2
        );
        p.vertex(
          cloth.bodies[belowIndex].position.x,
          cloth.bodies[belowIndex].position.y,
          u1,
          v2
        );
        p.endShape(p.CLOSE);
      }
    }
  }

  function displayTestParticle() {
    fc.push();
    let pos = particleTest.position;
    let angle = particleTest.angle;
    fc.translate(pos.x, pos.y);
    fc.rotate(angle);
    fc.rectMode(CENTER);
    fc.rect(0, 0, 100, 100);
    fc.pop();
  }

  //   function createConveyor(fc) {
  //     conveyor1 = new Conveyor(
  //       conveyor1.x,
  //       conveyor1.y,
  //       conveyor1.w,
  //       conveyor1.h,
  //       conveyor1.angle,
  //       world,
  //       fc,
  //       numberOfPins
  //     );

  //     conveyors.push(conveyor1);
  //   }

  function createBoundaries() {
    // push boundaries to the edge of canvas so they are invisible
    // adjustBoundaryPosition();
    // create boundaries around the canvas
    ground = new Boundary(
      boundaryGround.x,
      boundaryGround.y,
      boundaryGround.w,
      boundaryGround.h,
      boundaryGround.angle,
      world
    );
    // leftWall = new Boundary(
    //   boundaryLeftWall.x,
    //   boundaryLeftWall.y,
    //   boundaryLeftWall.w,
    //   boundaryLeftWall.h,
    //   boundaryLeftWall.angle,
    //   world
    // );
    // rightWall = new Boundary(
    //   boundaryRightWall.x,
    //   boundaryRightWall.y,
    //   boundaryRightWall.w,
    //   boundaryRightWall.h,
    //   boundaryRightWall.angle,
    //   world
    // );
    boundaries.push(ground);
  }

  //   function adjustBoundaryPosition() {
  //     boundaryGround.y = boundaryGround.y + boundaryGround.h / 2;
  //     boundaryLeftWall.x = boundaryLeftWall.x - boundaryLeftWall.w / 2;
  //     boundaryRightWall.x = boundaryRightWall.x + boundaryRightWall.w / 2;
  //   }
};

let myp5 = new p5(faceCanvas);
