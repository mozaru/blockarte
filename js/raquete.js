class Raquete {
  constructor(x, y, largura = 80, altura = 10, cor = '#00ccff') {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    this.vel = 300; // px/segundo
  }

  update(dt, input) {
    if (input.esquerda) this.x -= this.vel * dt;
    if (input.direita) this.x += this.vel * dt;
    this.x = Math.max(0, Math.min(400 - this.largura, this.x));
  }

  getRetangulo() {
    return { x: this.x, y: this.y, w: this.largura, h: this.altura };
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  desenhar(ctx) {
    ctx.save();

    // Sombra
    ctx.shadowColor = "#00000055";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Gradiente
    const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.altura);
    grad.addColorStop(0, '#ffffff88');
    grad.addColorStop(0.3, this.cor);
    grad.addColorStop(1, '#00000022');

    // Desenho com cantos arredondados
    this.drawRoundedRect(ctx, this.x, this.y, this.largura, this.altura, 5);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
  }
}
