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

    display() {
        let pos = this.body.position;
        push();
        rectMode(CENTER);
        fill(255, 0, 0);
        translate(pos.x, pos.y);
        rotate(this.body.angle);
        rect(0, 0, this.w, this.h);
        pop();
    }
}