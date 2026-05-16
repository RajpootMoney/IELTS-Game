import { Star, Particle } from '../types/game.types';

export function createStars(canvasWidth: number, canvasHeight: number, count: number = 100): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      brightness: Math.random()
    });
  }
  return stars;
}

export function updateStars(stars: Star[], canvasHeight: number): void {
  stars.forEach(star => {
    star.y += star.speed;
    if (star.y > canvasHeight) {
      star.y = 0;
      star.x = Math.random() * window.innerWidth;
    }
    // Twinkle effect
    star.brightness += (Math.random() - 0.5) * 0.1;
    star.brightness = Math.max(0.3, Math.min(1, star.brightness));
  });
}

export function drawStars(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.fill();
  });
}

export function createExplosion(x: number, y: number, color: string, count: number = 15): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = Math.random() * 3 + 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      color,
      size: Math.random() * 3 + 2
    });
  }
  return particles;
}

export function updateParticles(particles: Particle[]): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 0.02;
    
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function drawScanlines(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 1;
  
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.restore();
}

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, offset: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  const perspectiveOffset = offset % gridSize;
  
  // Vertical lines with perspective
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines moving down
  for (let y = perspectiveOffset; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  ctx.restore();
}

export default {
  createStars,
  updateStars,
  drawStars,
  createExplosion,
  updateParticles,
  drawParticles,
  drawScanlines,
  drawGrid
};
