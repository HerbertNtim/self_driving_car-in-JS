class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
    }
    // console.log(this.readings)
  }

  #getReadings(ray, roadBorders, traffic) {
    let touches = [];

    // Borders crash with road
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    // Traffic Crash
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if(value) {
          touches.push(value)
        }
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset === minOffset);
    }
  }

  #castRays() {
    this.rays = []; // ✅ Clear previous rays

    for (let i = 0; i < this.rayCount; i++) {
      const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, t) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const ray = this.rays[i];
      if (!ray || !ray[0] || !ray[1]) continue;

      let end = ray[1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      // yellow = visible ray
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // black = blocked ray (only if there's a reading)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
