class Tank {
    constructor(world) {

        this.x = 1200;
        this.y = 500;
        this.w = 30;
        this.h = 250;
        this.a = 0;

        this.tankWalls = [];
        // this.tankWalls.push(new Boundary(this.x, this.y, this.w, this.h, this.a, world));

        this.breakLine = {
            x: this.x,
            y: this.y,
            x2: this.x + 300,
            y2: this.y,
        }

        this.particles = [];
        // Calculate and display the midpoint
        this.midpoint = {
            x: (this.breakLine.x + this.breakLine.x2) / 2,
            y: (this.breakLine.y + this.breakLine.y2) / 2
        };
        this.tankWalls.push(new Boundary(this.x, this.y, this.w, this.h, this.a, world));
        this.tankWalls.push(new Boundary(this.x + 50, this.y + this.h / 2 + 20, 130, 30, this.a, world));
        this.particles.push(new Particle(this.x + 35, this.y + 100, 40, world));
        this.tankWalls.push(new Boundary(this.x + 110, this.y + 210, 30, 140, this.a, world));
        this.particles.push(new Particle(this.x + 90, this.y + 120, 30, world));
    }

    update(fc) {
        for (let i = 0; i < this.tankWalls.length; i++) {
            this.tankWalls[i].display(fc)
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].display(fc)
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