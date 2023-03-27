// create a new face (matter body and image)
class Face {
    constructor(x, y, poly, croppedFace) {
        this.x = x;
        this.y = y;
        this.image = croppedFace
        // polygon vertices created in the cutout function 
        // based on the keypoints
        this.poly = poly;
        this.options = {
            isStatic: false
        };
        // create a body from the poly vertices
        this.body = Bodies.fromVertices(this.x, this.y, this.poly, this.options);
        // add the body to the world
        World.add(world, this.body);
        // get the vertices from the body 
        this.vertices = this.body.vertices;
        // get position of body and angle
        this.pos = this.body.position;
        this.angle = this.body.angle;
        // path of the image to be defined after saving
        this.imagePath = null;
    }

    display() {
        // get live position of body and angle
        this.pos = this.body.position;
        this.angle = this.body.angle;
        // translate the 0,0 to the x and y of body
        // rotate the image based on the angle of body
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        // center and create image to match body 0,0
        imageMode(CENTER);
        image(this.image, 0, 0)
        pop();
    }

    setImageUrl(imagePath){
        this.imagePath = imagePath;
    }
}
    
    // --- CLIPPING MASK TO ADD TEXTURE - NOT NECESSARY BUT USEFUL IN 
    // OTHER CONTEXT --- TO TEST! WORKS WITH maskFaceImage method
    // create a new canvas for the cropped image of the face
    // this.mask = createGraphics(this.image.width, this.image.height);
    // this.ctx = this.mask.canvas.getContext("2d");

    // maskFaceImage() {
    //     // 
    //     beginShape();
    //     for (let i = 0; i < this.vertices.length; i++) {
    //         vertex(this.vertices[i].x - this.pos.x, this.vertices[i].y - this.pos.y);
    //     }
    //     endShape(CLOSE);

    //     this.mask.noFill();
    //     this.mask.beginShape();

    //     for (let i = 0; i < poly.length; i++) {
    //         this.mask.vertex(poly[i].x, poly[i].y);
    //     }
    //     this.mask.endShape(CLOSE);
    //     this.ctx.clip();
    // }
