class FaceParts {
    constructor(x, y, w, h, angle, facePartImage, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = facePartImage;

        this.options = {
            isStatic: false,
            friction: 1,
            restitution: .5
        };
        this.world = world;
        this.body = Matter.Bodies.rectangle(this.x, this.y, this.w, this.h, this.options);
        this.body.angle = angle;
        Matter.World.add(this.world, this.body);
    }

    display(fc) {
        // get live position of body and angle
        this.pos = this.body.position;
        this.angle = this.body.angle;
        // translate the 0,0 to the x and y of body
        // rotate the image based on the angle of body
        fc.push();
        fc.translate(this.pos.x, this.pos.y);
        fc.rotate(this.angle);
        // center and create image to match body 0,0
        fc.imageMode(CENTER);
        fc.image(this.image, 0, 0)
        fc.pop();
    }

    removeFromWorld(world) {
        Matter.World.remove(world, this.body);
    }
}