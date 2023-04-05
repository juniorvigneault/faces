// create 2 canvases
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

    // boundaries static matter js bodies bottom, left and right
    let ground, leftWall, rightWall;
    let boundaries = [];

    let boundaryGround = {
        x: 200,
        y: faceCanvasDimensions.height,
        // make sure the length of ground covers width of canvas
        w: faceCanvasDimensions.width * 2,
        h: 50,
        angle: 0
    };
    let boundaryLeftWall = {
        x: 0,
        y: 200,
        w: 50,
        // make sure the height of wall covers height of canvas
        h: faceCanvasDimensions.height * 2,
        angle: 0
    };
    let boundaryRightWall = {
        x: faceCanvasDimensions.width,
        y: 200,
        w: 50,
        // make sure the height of wall covers height of canvas
        h: faceCanvasDimensions.height * 2,
        angle: 0
    };

    let particleTest;

    let backgroundColor = 20;
    // setup function of face canvas 
    fc.setup = function () {
        let cnv = fc.createCanvas(faceCanvasDimensions.width, faceCanvasDimensions.height);
        cnv.parent('parent');
        let parentElement = document.getElementById('parent');
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

        // test particle setup (must run display test particle in draw)
        // particleTest = new Bodies.rectangle(200, 200, 100, 100);
        // World.add(world, particleTest);

        // fc.canvas.addEventListener('mousemove', mouseMoved);
    };

    // draw function of face canvas
    fc.draw = function () {
        display();
        flash();
        console.log(faces.length)
    };

    function display() {
        fc.background(backgroundColor);
        // display ground at the bottom of canvas
        for (let i = 0; i < boundaries.length; i++) {
            boundaries[i].display(fc);
        }

        for (let i = 0; i < faces.length; i++) {
            if (faces[i].isCreated === false) {
                faces[i].setup(world);
            } else {
                faces[i].display(fc);
            }

        }
        // displayTestParticle();
    };

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