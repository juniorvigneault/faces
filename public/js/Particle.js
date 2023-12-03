class Particle {
    constructor(x, y, r, world) {
        let options = {
            friction: 1,
            restitution: 0,
            isStatic: true
        }
        this.body = Matter.Bodies.circle(x, y, r, options);
        // converts radius to diameter
        this.r = r * 2;
        Matter.World.add(world, this.body);
    }

    display(fc) {
        fc.push();
        let pos = this.body.position;
        let angle = this.body.angle;
        fc.ellipseMode(CENTER);
        // noStroke();
        fc.translate(pos.x, pos.y);
        fc.rotate(angle);
        fc.stroke(0)
        fc.strokeWeight(1);
        fc.fill(255, 0, 0);
        // fill(this.red, this.green, this.blue, this.alpha)
        fc.ellipse(0, 0, this.r);
        fc.pop();
        //this.letterP();
    }
}