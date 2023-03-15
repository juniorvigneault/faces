class Box {
    constructor(x,y,w,h) {

        this.w = w;
        this.h = h;

        this.options = {
            isStatic: false
        }
        
        this.body = Bodies.rectangle(x, y, w, h, this.options);
        World.add(world, this.body);

    }


    display() {
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rect(0, 0, this.w, this.h);
        pop();
    };
}