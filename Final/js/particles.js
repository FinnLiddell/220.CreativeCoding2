// enemy.js — Enemy drones (appear from level 2+)

const ENEMY_SHOOT_INTERVAL = 90; // frames between enemy shots

class Enemy {
  constructor(level) {
    // Spawn from left or right edge
    this.x = Math.random() < 0.5 ? -30 : window._GAME_W + 30;
    this.y = 60 + Math.random() * 160;
    const speed = 1.5 + level * 0.2;
    this.vx = this.x < 0 ? speed : -speed;
    this.vy = 0.5;
    this.alive = true;
    this.hp = 2;
    this.shootTimer = Math.floor(Math.random() * 60);
    this.bullets = []; // enemy fires its own projectiles
  }

  update(ship) {
    this.x += this.vx;
    this.y += this.vy;

    // Despawn if off-screen
    if (this.x < -60 || this.x > window._GAME_W + 60 || this.y > window._GAME_H + 60) {
      this.alive = false;
    }

    // Shoot at player
    this.shootTimer++;
    if (this.shootTimer >= ENEMY_SHOOT_INTERVAL) {
      this.shootTimer = 0;
      const dx = ship.x - this.x;
      const dy = ship.y - this.y;
      const dist = Math.hypot(dx, dy);
      this.bullets.push({
        x: this.x,
        y: this.y,
        vx: (dx / dist) * 4,
        vy: (dy / dist) * 4,
        alive: true,
      });
      enemyShootSound();
    }

    // Move bullets
    for (const b of this.bullets) {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -10 || b.x > window._GAME_W + 10 ||
          b.y < -10 || b.y > window._GAME_H + 10) {
        b.alive = false;
      }
    }
    this.bullets = this.bullets.filter(b => b.alive);
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y);

    // Body
    p.fill(220, 80, 80);
    p.stroke(255, 140, 120);
    p.strokeWeight(1.5);
    p.ellipse(0, 0, 36, 22);

    // Core
    p.fill(255, 200, 80);
    p.noStroke();
    p.ellipse(0, 0, 14, 14);

    // Ring
    p.stroke(255, 100, 80);
    p.strokeWeight(1);
    p.noFill();
    p.ellipse(0, 0, 42, 28);

    // Draw bullets (relative to enemy's last position — we draw them globally below)
    p.pop();

    // Draw enemy bullets in world space
    p.noStroke();
    for (const b of this.bullets) {
      p.fill(255, 100, 80, 200);
      p.ellipse(b.x, b.y, 7, 7);
    }
  }
}
