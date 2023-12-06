class Boundary {
    constructor(x, y, w, h, angle, world) {
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
    }

    display(fc) {
        let pos = this.body.position;
        fc.push();
        fc.rectMode(CENTER);
        fc.fill(75);
        fc.noStroke();
        fc.translate(pos.x, pos.y);
        fc.rotate(this.body.angle);
        fc.rect(0, 0, this.w, this.h);
        fc.pop();
    }
}