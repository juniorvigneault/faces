let faces = [];

let isFlashing;
let flashTime = 50;
let flashColor = 255;
// let flashGradient = 50;
let flashTrigger = 1000;
let pictureTrigger = 50;

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

let canvasDimensions = {
    width: 480,
    height: 360
}

let boundaryGround = {
    x: 200,
    y: canvasDimensions.height,
    // make sure the length of ground covers width of canvas
    w: canvasDimensions.width * 2,
    h: 50,
    angle: 0
};
let boundaryLeftWall = {
    x: 0,
    y: 200,
    w: 50,
    // make sure the height of wall covers height of canvas
    h: canvasDimensions.height * 2,
    angle: 0
};
let boundaryRightWall = {
    x: canvasDimensions.width,
    y: 200,
    w: 50,
    // make sure the height of wall covers height of canvas
    h: canvasDimensions.height * 2,
    angle: 0
};

let particleTest;

let backgroundColor = 255;
// setup function of face canvas 
function setup() {
    let cnv = createCanvas(canvasDimensions.width, canvasDimensions.height);
    cnv.parent('p5Canvas')
    let p5Element = document.getElementById('p5Canvas');
    engine = Engine.create();
    world = engine.world;
    runner = Runner.create();
    Matter.Runner.run(runner, engine);
    let body = document.querySelector('body');
    mouse = Mouse.create(body),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse
        });
    // Add the mouse constraint to the world
    World.add(world, mouseConstraint);
    // create physical bounderies around the canvas to hold faces
    createBoundaries();

    // test particle setup (must run display test particle in draw)
    particleTest = new Bodies.rectangle(200, 200, 100, 100);
    World.add(world, particleTest);

    // fc.canvas.addEventListener('mousemove', mouseMoved);
};

// draw function of face canvas
function draw() {
    display();
    flash();
};

function display() {
    background(backgroundColor);
    // display ground at the bottom of canvas
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].display();
    }

    for (let i = 0; i < faces.length; i++) {
        if (faces[i].isCreated === false) {
            faces[i].setup(world);
        } else {
            faces[i].display();
        }

    }
    displayTestParticle();
};

function flash() {
    if (isFlashing) {
        noStroke();
        push();
        fill(flashColor);
        rectMode(CENTER);
        rect(width / 2, height / 2, width, height);
        pop();
    }
}

function displayTestParticle() {
    push();
    let pos = particleTest.position;
    let angle = particleTest.angle;
    translate(pos.x, pos.y)
    rotate(angle);
    rectMode(CENTER);
    rect(0, 0, 100, 100);
    pop();
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