let currentScreen=null;
function showScreen(screenId) {
  audio.tocarTrilha("Menu");
  document.getElementById('mobile-controls').style.display = 'none';
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  if (screenId == 'level-select')
    generateLevelButtons();
  currentScreen = screenId;
}

function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
  document.querySelectorAll('.modal').forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  if (currentScreen!='game-screen')
    audio.tocarTrilha("Menu");
}

const TOTAL_FASES = 9;
const FASES = [
  { nome:"Fase 1",  assets:"criatura 10000pts-1.webp", classe: Criatura10000PTS_1},
  { nome:"Fase 2",  assets:"criatura 10000pts-2.webp", classe: Criatura10000PTS_2},
  { nome:"Fase 3",  assets:"criatura 10000pts-3.webp", classe: Criatura10000PTS_3},
  { nome:"Fase 4",  assets:"criatura 10000pts-4.webp", classe: Criatura10000PTS_4},
  { nome:"Fase 5",  assets:"criatura 10000pts-5.webp", classe: Criatura10000PTS_5},
  { nome:"Fase 6",  assets:"criatura 10000pts-6.webp", classe: Criatura10000PTS_6},
  { nome:"Fase 7",  assets:"criatura 10000pts-7.webp", classe: Criatura10000PTS_7},
  { nome:"Fase 8",  assets:"criatura 10000pts-8.webp", classe: Criatura10000PTS_8},
  { nome:"Fase 9",  assets:"criatura 10000pts-9.webp", classe: Criatura10000PTS_9},
  { nome:"Fase 10", assets:"criatura 40000pts-1.webp", classe: Criatura40000PTS_1},
];

function generateLevelButtons() {
  const container = document.getElementById("levels-container");
  container.innerHTML = "";

  const progresso = JSON.parse(localStorage.getItem("blockmarte_progress")) || {
    unlocked: 2
  };

  for (let i = 1; i <= TOTAL_FASES; i++) {
    const btn = document.createElement("button");
    btn.classList.add("level-button");

    const img = document.createElement("img");
    if (settings.faseLiberada(i)) {
      img.src = `assets/${FASES[i-1].assets}`;
      btn.onclick = () => startGame(i);
    } else {
      img.src = `assets/lock.png`;
      btn.classList.add("locked");
      btn.disabled = true;
    }

    const label = document.createElement("span");
    label.textContent = FASES[i-1].nome;

    btn.appendChild(img);
    btn.appendChild(label);
    container.appendChild(btn);
  }

  // Boss button
  const bossBtn = document.createElement("button");
  bossBtn.classList.add("level-button", "boss-button");

  const bossImg = document.createElement("img");
  const bossLabel = document.createElement("span");
  bossLabel.textContent = "Boss Final";

  if (settings.faseLiberada(TOTAL_FASES+1)) {
    bossImg.src = `assets/${FASES[TOTAL_FASES].assets}`;
    bossBtn.onclick = () => startGame(10);
  } else {
    bossImg.src = `assets/lock.png`;
    bossBtn.classList.add("locked");
    bossBtn.disabled = true;
  }

  bossBtn.appendChild(bossImg);
  bossBtn.appendChild(bossLabel);
  container.appendChild(bossBtn);
}

let cena, cenaCanvas, gameLoopId,ultimoTempo,faseCorrente;
const settings = Settings.carregar();
const audio = new AudioJogo(settings);

function startGame(fase) {
  showScreen('game-screen');
  faseCorrente = fase;
  document.getElementById('status-jogo').textContent = `Fase ${fase}`;

  
  const criatura = new FASES[fase-1].classe();
  const canvas = document.getElementById("game-canvas");
  cena = new Cena(fase, criatura, audio, settings);
  cenaCanvas = new CenaCanvas(canvas, cena, settings);
  
  document.getElementById("btnReiniciar").visibility = false


  

  /*let ultimoTempo = null;
  const progresso = JSON.parse(localStorage.getItem("blockmarte_progress")) || { unlocked: 2 };
  if (fase === progresso.unlocked && fase < TOTAL_FASES) {
    progresso.unlocked++;
    localStorage.setItem("blockmarte_progress", JSON.stringify(progresso));
  }
  generateLevelButtons();
  */

  const placar = document.getElementById("placar");
  const btnAvancar = document.getElementById("btnAvancar");
  const btnVoltarSelecao = document.getElementById("btnVoltarSelecao");
  const btnReiniciar = document.getElementById("btnReiniciar");
  const btnPausar = document.getElementById("btnPausar");
  btnVoltarSelecao.style.display = "none";
  btnReiniciar.style.display = "none";
  btnAvancar.style.display = "none";
  btnPausar.style.display = "none";

  function loop(t) {
    if (!ultimoTempo) ultimoTempo = t;
    const dt = (t - ultimoTempo) / 1000;
    ultimoTempo = t;

    cena.update(dt);
    cenaCanvas.desenhar();

    placar.textContent = `Pontuação: ${cena.pontuacao}`;

    if (cena.estado === "jogando" || cena.estado === "pausado") {
      gameLoopId = requestAnimationFrame(loop);
    }
    else{
      btnAvancar.style.display = fase<10 && cena.estado === "vitoria"?"inline-block":"none";
    }
    btnVoltarSelecao.style.display = cena.estado !== "jogando" ?"inline-block":"none";
    btnReiniciar.style.display = cena.estado !== "jogando"?"inline-block":"none";
    btnPausar.style.display = cena.estado === "jogando"?"inline-block":"none";
  }

  cancelAnimationFrame(gameLoopId); // Para loops anteriores
  requestAnimationFrame(loop);
}
function voltarParaSelecao() {
  cancelAnimationFrame(gameLoopId);
  showScreen('level-select');
  generateLevelButtons();
}

function pausar() {
  if (cena.estado === "jogando")
  {
    //document.getElementById("btnPausar").textContent = "Reiniciar";
    cena.estado = "pausado";
  }
  else if (cena.estado === "pausado")
  {
    //document.getElementById("btnPausar").textContent = "Pausar";
    cena.estado = "jogando";
    cena.aguardaPrimeiroMovimento = true;
  }
}

function reiniciar(){
  cena.estado === "reinicio";
  startGame(faseCorrente);
}

function proxima(){
  if (cena.estado=="vitoria")
    startGame(faseCorrente+1);
}

//usuario
function abrirModalUsuario() {
  const modal = document.getElementById('modal-usuario');
  const lista = document.getElementById('lista-usuarios');
  lista.innerHTML = "";

  for (const apelido in settings.jogadores) {
    const opt = document.createElement("option");
    opt.value = apelido;
    opt.textContent = apelido;
    if (apelido === settings.jogadorCorrente) {
      opt.selected = true;
    }
    lista.appendChild(opt);
  }

  openModal('modal-usuario');
}

function confirmarUsuario() {
  const lista = document.getElementById('lista-usuarios');
  const selecionado = lista.value;
  settings.setJogadorCorrente(selecionado);
  closeModal('modal-usuario');
}

function salvarNovoUsuario() {
  const apelido = document.getElementById('novo-apelido').value.trim();
  const nome = document.getElementById('novo-nome').value.trim();
  const email = document.getElementById('novo-email').value.trim();

  if (apelido && nome) {
    const sucesso = settings.adicionarJogador(apelido, nome, email);
    if (sucesso) {
      closeModal('modal-criar-usuario');
      abrirModalUsuario(); // Reabre e atualiza a lista
    } else {
      mostrarAlerta("Erro","Apelido já existe!");
    }
  } else {
    mostrarAlerta("Erro","Preencha apelido e nome.");
  }
}


// modal ranking
function formatarTempo(segundos) {
  const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
  const seg = Math.floor(segundos % 60);
  const s = String(seg).padStart(2, '0');
  const milis = String(Math.floor(1000*((segundos%60)-seg))).padStart(3, '0');
  return `${h}:${m}:${s}.${milis}`;
}

function abrirRanking() {
  const top20 = settings.getTop20();
  const tbody = document.querySelector("#tabela-ranking tbody");
  tbody.innerHTML = "";

  top20.forEach((jogador, index) => {
    const tr = document.createElement("tr");
    if (jogador.apelido === settings.jogadorCorrente)
      tr.classList.add("ranking-corrente");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${jogador.apelido}</td>
      <td>${jogador.pts}</td>
      <td>${formatarTempo(jogador.tempo)}</td>
    `;
    tbody.appendChild(tr);
  });

  openModal('modal-ranking');
}


//settings
function abrirSettings() {
  const v = settings.volumes;
  const m = settings.muted;

  document.getElementById("vol-geral").value = v.geral;
  document.getElementById("vol-trilha").value = v.trilha;
  document.getElementById("vol-efeitos").value = v.efeitos;

  document.getElementById("mute-geral").textContent = m.geral ? "🔇" : "🔊";
  document.getElementById("mute-trilha").textContent = m.trilha ? "🔇" : "🔊";
  document.getElementById("mute-efeitos").textContent = m.efeitos ? "🔇" : "🔊";

  document.getElementById("vol-geral").disabled = m.geral;
  document.getElementById("vol-trilha").disabled = m.geral || m.trilha;
  document.getElementById("vol-efeitos").disabled = m.geral || m.efeitos;

  document.getElementById("nivel-dificuldade").value = settings.dificuldade || "normal";

  openModal("modal-settings");
}

function ajustarVolume(tipo) {
  if (settings.muted[tipo] || settings.muted.geral) return;

  const valor = parseFloat(document.getElementById(`vol-${tipo}`).value);
  settings.atualizarVolume(tipo, valor);

  if (tipo === "trilha") {
    audio.atualizarVolumeTrilha();
  } else if (tipo === "efeitos") {
    audio.tocarEfeito("raquete"); // substitua se o nome do som for outro
  } else if (tipo === "geral") {
    audio.atualizarVolumeTrilha();
  }
}

function toggleMute(tipo) {
  settings.muted[tipo] = !settings.muted[tipo];
  document.getElementById(`mute-${tipo}`).textContent = settings.muted[tipo] ? "🔇" : "🔊";

  // Reaplica as regras de desativação
  document.getElementById("vol-geral").disabled = settings.muted.geral;
  document.getElementById("vol-trilha").disabled = settings.muted.geral || settings.muted.trilha;
  document.getElementById("vol-efeitos").disabled = settings.muted.geral || settings.muted.efeitos;

  audio.atualizarVolumeTrilha();

  if (tipo === "efeitos" && !settings.muted.efeitos && !settings.muted.geral) {
    audio.tocarEfeito("raquete");
  }
}

function salvarConfiguracoes() {
if (!settings.muted.geral)
    settings.atualizarVolume("geral", parseFloat(document.getElementById("vol-geral").value));
  if (!settings.muted.trilha)
    settings.atualizarVolume("trilha", parseFloat(document.getElementById("vol-trilha").value));
  if (!settings.muted.efeitos)
    settings.atualizarVolume("efeitos", parseFloat(document.getElementById("vol-efeitos").value));

  settings.dificuldade = document.getElementById("nivel-dificuldade").value;

  settings.salvar();
  closeModal("modal-settings");
}

//GALERIA
function abrirGaleria() {
  const lista = document.getElementById("galeria-lista");
  lista.innerHTML = "";

  const fases = FASES;
  fases.forEach((fase, i) => {
    const desbloqueada = settings.faseLiberada(i+1);

    const linha = document.createElement("div");
    linha.className = `galeria-item-linha ${i % 2 === 0 ? 'par' : 'impar'}`;
    if (!desbloqueada) linha.classList.add("bloqueada");

    const img = document.createElement("img");
    img.src = desbloqueada ? `assets/${fase.assets}` : "assets/lock.png";

    const label = document.createElement("p");
    const pontos = i<2?0:i*10000;

    label.textContent = desbloqueada ? `${fase.nome} - ${fase.classe.getBioName()}` : `??? - (Pontos necessários: ${pontos})`;
    linha.appendChild(img);
    linha.appendChild(label);

    if (desbloqueada) {
      linha.onclick = () => abrirDetalhesCriatura(fase, i + 1);
    }

    lista.appendChild(linha);
  });

  openModal('modal-galeria');
}

function abrirDetalhesCriatura(fase, numeroFase) {
  document.getElementById("detalhe-nome").innerText = fase.classe.getBioName();
  document.getElementById("detalhe-img").src = `assets/${fase.assets}`;
  document.getElementById("detalhe-pontos").textContent = `Pontos: ${numeroFase < 10 ? 10000 : 40000}`;
  document.getElementById("detalhe-descricao").innerHTML = fase.classe.getDescription();
  document.getElementById("detalhe-formula").innerHTML = fase.classe.getFormula();
  openModal("modal-detalhe-criatura");
}



//alertas
function mostrarAlerta(titulo, mensagem) {
  document.getElementById("alerta-titulo").textContent = titulo || "Aviso";
  document.getElementById("alerta-mensagem").textContent = mensagem || "Algo inesperado aconteceu.";
  openModal('modal-alerta');
}

// Chamar isso sempre que a tela de fases for aberta
document.getElementById("level-select").addEventListener("click", generateLevelButtons);

window.onload = () => {
  abrirModalUsuario();
};