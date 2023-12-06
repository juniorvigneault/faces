class Conveyor {
    constructor(x, y, w, h, angle, world, fc, numPins) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.options = {
            isStatic: true,
            friction: 0,
            restitution: 0.5
        };
        this.world = world;
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, this.options);
        this.body.angle = angle;
        Matter.World.add(this.world, this.body);

        this.conveyorPins = [];
        this.numPins = numPins;
        this.createConveyorPins();
    }

    display(fc) {
        this.displayConveyorPins(fc);

        let pos = this.body.position;
        fc.push();
        fc.rectMode(CENTER);
        fc.noStroke();
        fc.fill(75);
        fc.translate(pos.x, pos.y);
        fc.rotate(this.body.angle);
        fc.rect(0, 0, this.w, this.h);
        fc.pop();



        // move pin on path
        // this.force = this.conveyorPins[0].conveyorPinFollow(this.path);
        // this.conveyorPins[0].applyForce(this.force);
    }


    createConveyorPins() {

        for (let i = 0; i < this.numPins; i++) {
            this.conveyorPins.push(new ConveyorPin(this.x, this.y, 10, 40, 0, this.world))
        }

    }

    displayConveyorPins(fc) {
        // display all pins
        for (let i = 0; i < this.conveyorPins.length; i++) {
            this.conveyorPins[i].display(fc);
        }
    }
}