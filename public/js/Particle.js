class Particle {
  constructor(x, y, w, h, world) {
    let options = {
      friction: 1,
      restitution: 0,
      isStatic: false,
    };
    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    // converts radius to diameter
    this.w = w;
    this.h = h;
    Matter.World.add(world, this.body);
  }

  display(fc) {
    fc.push();
    let pos = this.body.position;
    let angle = this.body.angle;
    fc.rectMode(CENTER);
    // noStroke();
    fc.translate(pos.x, pos.y);
    fc.rotate(angle);
    fc.stroke(0);
    fc.strokeWeight(1);
    fc.fill(255, 0, 0);
    // fill(this.red, this.green, this.blue, this.alpha)
    fc.rect(0, 0, this.w, this.h);
    fc.pop();
    //this.letterP();
  }
}
