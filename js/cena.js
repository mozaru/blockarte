let pontoAcumulado=0, tempoAcumulado=0, idjogo;
class Cena {
  constructor(fase,criatura, audio, settings) {
    this.settings = settings;
    this.fase = fase;
    this.raquete = new Raquete(160, 380);
    this.restantes = criatura.quantidade;
    this.bola = new Bola(200, 200);
    if (settings.dificuldade=="easy")
    {
      this.bola.raio = 50;
      this.bola.velocidade = 2;
      this.raquete.largura = 140;
    }
    else if (settings.dificuldade=="hard")
    {
      this.bola.raio = 5;
      this.bola.velocidade = 3;
      this.raquete.largura = 60
    }
    else
    {
      this.bola.raio = 10;
      this.bola.velocidade = 2;
      this.raquete.largura = 100;
    }

    
    this.criatura = criatura;
    this.input = new Input();
    this.pontuacao = pontoAcumulado;
    this.tempoJogando = tempoAcumulado;
    this.estado = "jogando"; // ou "vitoria", "morte", "pausa", "reinicio"
    this.aguardaPrimeiroMovimento = true;
    this.tempo = 0;
    this.audio = audio;
    if (criatura.ehBoss)
      this.audio.tocarTrilha('Boss');
    else
      this.audio.tocarTrilha('Fase');
  }

  update(dt) {
    if (this.estado !== "jogando") return;

    this.input.update();
    this.raquete.update(dt, this.input);
    if (this.aguardaPrimeiroMovimento){
      if (this.input.esquerda || this.input.direita)
        this.aguardaPrimeiroMovimento = false;
      else
        dt=0;
    }
    if (this.bola.update(dt))
      this.audio.tocarEfeito("parede");

    this.criatura.update(this.tempo+dt);

    if (this.aguardaPrimeiroMovimento) return;
    if (this.bola.colisaoComRaquete(this.raquete))
      this.audio.tocarEfeito("raquete");

    const acertos = this.criatura.checarColisoes(this.bola);
    if (acertos>0)
      this.audio.tocarEfeito("bloco");
    this.pontuacao += acertos;
    this.restantes -= acertos;
    this.tempo += dt;
    this.tempoJogando += dt;

    if (this.restantes <= 0 ) { 
      pontoAcumulado=this.pontuacao; 
      tempoAcumulado=this.tempoJogando; 
      this.estado = "vitoria"; 
      this.audio.tocarEfeito("vitoria");  
    } else if (this.bola.y > 400) { 
      this.estado = "morte";   
      this.audio.tocarEfeito("gameover"); 
      pontoAcumulado=0; tempoAcumulado=0; 
    }
    
    if (this.estado !== "jogando")
    {
      document.getElementById('mobile-controls').style.display = 'none';
      settings.adicionarPlacar(this.estado=="vitoria"?this.fase+1:this.fase, this.pontuacao, this.tempoJogando);
    }
  }
}
