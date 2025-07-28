class AudioJogo {
  constructor(settings) {
    this.settings = settings;
    this.trilhaMenu = new Audio('assets/sons/trilha_menu.mp3');
    this.trilhaFase = new Audio('assets/sons/trilha_fase.mp3');
    this.trilhaBoss = new Audio('assets/sons/trilha_boss.mp3');
    this.lastTrilha = null;
    this.efeitos = {
      raquete: new Audio('assets/sons/hit_raquete.wav'),
      parede: new Audio('assets/sons/hit_parede.wav'),
      bloco: new Audio('assets/sons/hit_bloco.wav'),
      vitoria: new Audio('assets/sons/vitoria.wav'),
      gameover: new Audio('assets/sons/game_over.wav')
    };

    // loop trilhas
    this.trilhaMenu.loop = true;
    this.trilhaFase.loop = true;
    this.trilhaBoss.loop = true;
  }

  atualizarVolumeTrilha() {
  if (this.trilhaAtual) {
    const volume = this.settings.muted.geral || this.settings.muted.trilha
      ? 0
      : this.settings.volumes.geral * this.settings.volumes.trilha;
    this.trilhaAtual.volume = volume;
  }
}

  tocarTrilha(nome) {
    if (this.lastTrilha == nome) return;
    this.pararTudo();
    this.trilhaAtual = this[`trilha${nome}`];
    if (this.trilhaAtual) {
      this.trilhaAtual.currentTime = 0;
      const volume = this.settings.muted.geral || this.settings.muted.trilha ? 0 : this.settings.volumes.geral * this.settings.volumes.trilha;
      this.trilhaAtual.volume = volume;
      this.trilhaAtual.play();
      this.lastTrilha = nome;
    }
  }

  pararTudo() {
    this.trilhaMenu.pause();
    this.trilhaFase.pause();
    this.trilhaBoss.pause();
  }

  tocarEfeito(nome) {
    const som = this.efeitos[nome]?.cloneNode();
    const volume = this.settings.muted.geral || this.settings.muted.efeitos ? 0 : this.settings.volumes.geral * this.settings.volumes.efeitos;
    som.volume = volume;
    som?.play();
  }
}