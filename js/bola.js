class Bola {
  constructor(x, y, raio = 5, cor = '#ff0044') {
    this._FATOR_ = 150;
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.cor = cor;
    this.velocidade = 1;
    this.direcao(1,-1);
  }

  direcao(x,y){
    const magnitude = Math.sqrt(x *x + y * y);
    if (magnitude === 0) {
      this.dx=1; 
      this.dy=-1
    }
    else
    {
      this.dx = x / magnitude;
      this.dy = y / magnitude;
    }
  }

  update(dt) {
    this.x += this.dx * dt*this._FATOR_*this.velocidade;
    this.y += this.dy * dt*this._FATOR_*this.velocidade;
    let parede = false;

    if (this.x-this.raio <= 0)   { this.dx *= -1; this.x = this.raio;     parede=true; }
    if (this.x+this.raio >= 400) { this.dx *= -1; this.x = 400-this.raio; parede=true; }
    if (this.y-this.raio <= 0)   { this.dy *= -1; this.y = this.raio;     parede=true; }

    return parede;
  }
 
  distanciaBolaRaquete(x1,x2,y) {
    if (this.x >= x1 && this.x <= x2) {
      return Math.abs(this.y - y);
    } else {
      const dx = this.x < x1 ? this.x - x1 : this.x - x2;
      const dy = this.y - y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  colisaoComRaquete(raquete) {
    const r = raquete.getRetangulo();
    if (this.distanciaBolaRaquete(r.x,r.x+r.w, r.y)<this.raio)
    {
      let impacto = (this.x - r.x) / r.w;
      if (impacto<0) impacto = 0;
      if (impacto>1) impacto = 1;
      const fx = this.dx + (impacto - 0.5) * 1.5;
      if (fx < -0.8)
        this.direcao(-0.8, -this.dy);  
      else if (fx > 0.8)
        this.direcao(0.8, -this.dy);  
      else
        this.direcao(fx, -this.dy);
      //this.dx = Math.cos(angulo)
      //this.dy = -Math.abs(Math.sin(angulo));
      this.y = r.y - this.raio;
      return true;
    }
    return false;
  }

  desenhar(ctx) {
    const grad = ctx.createRadialGradient(
      this.x, this.y, this.raio * 0.1, // centro da luz
      this.x, this.y, this.raio        // borda escura
    );

    grad.addColorStop(0, this.cor);
    grad.addColorStop(1, 'black');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fill();
  }
}
