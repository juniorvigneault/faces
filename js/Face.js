class Face {
    constructor(x, y, poly, croppedFace) {

        this.x = x;
        this.y = y;
        this.image = croppedFace
        this.poly = poly;
        this.options = {
            isStatic: true
        };
        this.body = Bodies.fromVertices(this.x, this.y, this.poly, this.options);
        World.add(world, this.body);

    }


    display() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);

        // Draw the contour of the body
        beginShape();
        let vertices = this.body.vertices;
        for (let i = 0; i < vertices.length; i++) {
            vertex(vertices[i].x - pos.x, vertices[i].y - pos.y);
        }
        endShape(CLOSE);

        let imgX = -this.image.width / 2;
        let imgY = -this.image.height / 2;
        image(this.image, imgX, imgY);
        pop();
    }
}