class Box {
    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.options = {
            isStatic: false
        };
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, this.options);
        World.add(world, this.body);

    }


    display() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        rectMode(CENTER);
        translate(pos.x, pos.y);
        rotate(angle);
        rect(0, 0, this.w, this.h);
        pop();
    }
}