class Tank {
    constructor(world) {

        this.x = 750;
        this.y = 500;
        this.w = 20;
        this.h = 200;
        this.a = 0;

        this.tankWalls = [];
        // this.tankWalls.push(new Boundary(this.x, this.y, this.w, this.h, this.a, world));

        this.breakLine = {
            x: this.x,
            y: this.y,
            x2: this.x + 300,
            y2: this.y,
        }

        // Calculate and display the midpoint
        this.midpoint = {
            x: (this.breakLine.x + this.breakLine.x2) / 2,
            y: (this.breakLine.y + this.breakLine.y2) / 2
        };
        // this.tankWalls.push(new Boundary(this.x + 57, this.y + 125, this.w, this.h - 60, 90, world));
        // this.tankWalls.push(new Boundary(864, 700, 20, 100, 0, world));
    }

    update(fc) {
        for (let i = 0; i < this.tankWalls.length; i++) {
            this.tankWalls[i].display(fc)
        }
        this.drawLine(fc);
    }

    drawLine(fc) {
        fc.push();
        fc.stroke(0);
        fc.line(this.breakLine.x, this.breakLine.y, this.breakLine.x2, this.breakLine.y2);
        fc.pop();
    }
}