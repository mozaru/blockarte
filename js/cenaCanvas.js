class CenaCanvas {
  constructor(canvas, cena) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.cena = cena;
    this.lastTime = performance.now();
    this.fps = 0;
    this.frames = 0;
  }

  desenhar() {
    if (performance.now()-this.lastTime>1000)
    {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = performance.now();
    }
    this.frames++;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.cena.criatura.desenhar(ctx);
    this.cena.raquete.desenhar(ctx);
    this.cena.bola.desenhar(ctx);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Orbitron";
    ctx.fillText("FPS: " + this.fps, 10, 20);

    if (this.cena.estado === "jogando" && this.cena.aguardaPrimeiroMovimento)
    {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("MOVIMENTE A RAQUETE", 50, 250);
      ctx.fillText("PARA INICIAR", 110, 300);
    }
    else if (this.cena.estado === "pausado") {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("P A U S A D O", 120, 250);
    } else if (this.cena.estado === "vitoria") {
      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("V I T Ó R I A!", 130, 250);
    } else if (this.cena.estado === "morte") {
      ctx.fillStyle = "#ff3333";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("FIM DE JOGO", 120, 250);
    }
  }
}
