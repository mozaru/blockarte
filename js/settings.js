class Settings {
  constructor() {
    this.jogadorCorrente = 'Jogador 1';
    this.jogadores = {};
    this.jogadores[this.jogadorCorrente] = { apelido:'Jogador 1', nome: 'Jogador 1', email:'', record:0, tempo:0, fasesLiberadas: [true,true,false,false,false,false,false,false,false,false] };
    this.volumes = {
      geral: 1.0,
      trilha: 0.7,
      efeitos: 1.0
    };
    this.dificuldade = "normal";
    this.muted = {
        geral: false,
        trilha: false,
        efeitos: false
    };
    this.recorde = 0;
    this.top20 = [];
    for(let i=0;i<20;i++)
        this.top20.push( { apelido:"Mozar Silva", nome:"Mozar Silva", pts : 10000, tempo: 356400 } );
  }
  existeJogador(apelido){
    return this.jogadores[apelido]?true:false;
  }
  adicionarJogador(apelido, nome, email = '') {
    if (this.jogadores[apelido]) {
        console.warn("Apelido já existe!");
        return false;
    }
    this.jogadores[apelido] = {
        apelido,
        nome,
        email,
        record: 0,
        record:0, 
        tempo:0, 
        fasesLiberadas: [true,true,false,false,false,false,false,false,false,false]
    };
    this.jogadorCorrente = apelido;
    this.salvar();
    
    const data = new URLSearchParams();
    data.append("apelido", apelido);
    data.append("nome", nome);
    data.append("email", email);

    fetch("https://script.google.com/macros/s/AKfycbzdGDWWPsB7VZ651nmOEWUm5SldzIcS6-x-8uvUyjyFISj5y60mvoVyPxDy0O8R-YFR/exec", {
        method: "POST",
        body: data,
    })
    .then(res => res.text())
    .then(msg => console.log("Resposta:", msg))
    .catch(err => console.error("Erro:", err));
    return true;
  }
  
  setJogadorCorrente(apelido) {
    if (this.jogadores[apelido]) {
        this.jogadorCorrente = apelido;
    }
    this.salvar();
  }
  atualizarVolume(tipo, valor) {
    if (this.volumes[tipo] != null) {
      this.volumes[tipo] = Math.max(0, Math.min(1, valor));
    }
  }
  getTop20() {
    return this.top20;
  }

  faseLiberada(fase){
    const jog = this.jogadores[this.jogadorCorrente];
    return jog.fasesLiberadas[fase-1];
  }

  salvar() {
    localStorage.setItem('blockart.settings', JSON.stringify(this));
  }

  adicionarPlacar(fase, pts, t) {
    const jog = this.jogadores[this.jogadorCorrente]
    const tempo = t;
    this.top20.push({ apelido:jog.apelido, pts, tempo });
    this.top20.sort((a, b) => (b.pts != a.pts) ? b.pts - a.pts : a.tempo - b.tempo);
    if (this.top20.length > 20) {
        this.top20.length = 20;
    }
    if (this.recorde<pts)
        this.recorde = pts;
    if (jog.record<pts || (jog.record==pts && jog.tempo<tempo))
    {
        jog.record = pts;
        jog.tempo = tempo;
    }
    jog.fasesLiberadas[fase-1] = true;
    this.salvar();
  }

  static carregar() {
    const json = localStorage.getItem('blockart.settings');
    if (json) {
      const dados = JSON.parse(json);
      const s = new Settings();
      Object.assign(s, dados);
      return s;
    }
    return new Settings();
  }
}