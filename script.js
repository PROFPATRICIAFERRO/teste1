// script.js
// Estado global do jogo
const estado = {
  nomeJogador: '',
  personagemEscolhido: '',
  telaAtual: 'inicial',
  indiceFala: 0,
  indiceFalaMissao: 0,
  indiceFalaPosM1: 0,
  indiceFalaPosM2: 0,
  indiceFalaFinal: 0,
  missao1Flores: 0,
  missao1Energia: 5,
  missao1Ativa: false,
  missao1Intervalo: null,
  missao1Obstaculos: [],
  missao1FloresArr: [],
  missao1Velocidade: 2,
  missao2ItensCorretos: 0,
  missao2TotalCorretos: 4,
  sementeEscolhida: '',
  jogoConcluido: false,
};

// Referências DOM
const $logosBar = document.getElementById('logos-bar');
const $screenInicial = document.getElementById('screen-inicial');
const $screenApresentacao = document.getElementById('screen-apresentacao');
const $screenEscolhaPersonagem = document.getElementById('screen-escolha-personagem');
const $screenFalasMissao = document.getElementById('screen-falas-missao');
const $screenMissao1 = document.getElementById('screen-missao1');
const $screenFalasPosM1 = document.getElementById('screen-falas-pos-m1');
const $screenMissao2 = document.getElementById('screen-missao2');
const $screenFalasPosM2 = document.getElementById('screen-falas-pos-m2');
const $screenMissao3 = document.getElementById('screen-missao3');
const $screenFinal = document.getElementById('screen-final');
const $screenCertificado = document.getElementById('screen-certificado');

const todasTelas = [
  $screenInicial, $screenApresentacao, $screenEscolhaPersonagem,
  $screenFalasMissao, $screenMissao1, $screenFalasPosM1,
  $screenMissao2, $screenFalasPosM2, $screenMissao3,
  $screenFinal, $screenCertificado
];

function mostrarTela(screenElement) {
  todasTelas.forEach(s => s.classList.remove('active'));
  screenElement.classList.add('active');
  void screenElement.offsetWidth; // reflow
}

function mostrarLogos(visivel = true) {
  $logosBar.style.display = visivel ? 'flex' : 'none';
}

// ========== TELA INICIAL ==========
function iniciarJogo() {
  mostrarLogos(true);
  mostrarTela($screenApresentacao);
  estado.indiceFala = 0;
  document.getElementById('balao-texto').textContent =
    'Olá! Eu sou a Adelita e faço parte dos AgroHeróis! Qual é o seu nome? 👋';
  document.getElementById('input-nome-container').classList.remove('hidden');
  document.getElementById('seta-avancar-ap').classList.add('hidden');
  document.getElementById('adelita-apresentacao').style.display = 'flex';
}

function confirmarNome() {
  const input = document.getElementById('input-nome-jogador');
  const nome = input.value.trim();
  if (nome.length < 2) {
    alert('Por favor, digite um nome com pelo menos 2 caracteres!');
    return;
  }
  estado.nomeJogador = nome;
  document.getElementById('input-nome-container').classList.add('hidden');
  document.getElementById('seta-avancar-ap').classList.remove('hidden');
  document.getElementById('balao-texto').textContent =
    `Que nome lindo, ${estado.nomeJogador}! 😍\nHoje você vai participar de uma missão muito importante! Escolha seu personagem clicando nele.`;
  estado.indiceFala = 1;
}

function avancarFala() {
  if (estado.indiceFala >= 1) {
    document.getElementById('adelita-apresentacao').style.display = 'none';
    document.getElementById('balao-texto').textContent = 'Escolha seu personagem clicando nele! 👆';
    document.getElementById('seta-avancar-ap').classList.add('hidden');
    setTimeout(() => {
      mostrarTela($screenEscolhaPersonagem);
    }, 400);
  }
}

// ========== ESCOLHA DE PERSONAGEM ==========
function escolherPersonagem(tipo) {
  estado.personagemEscolhido = tipo;
  mostrarTela($screenFalasMissao);
  estado.indiceFalaMissao = 0;
  document.getElementById('balao-falas-missao').textContent =
    `UAL!!! O tema da nossa aventura é:\n\n🌾 Agro Forte, Futuro Sustentável: Equilíbrio entre Produção e Meio Ambiente 🌍`;
  document.getElementById('seta-falas-missao').classList.remove('hidden');
  document.getElementById('btn-comecar-missao1').classList.add('hidden');
  document.querySelector('#screen-falas-missao .adelita-img').style.display = 'flex';
}

// ========== FALAS DA MISSÃO ==========
const falasMissao = [
  'UAL!!! O tema da nossa aventura é:\n\n🌾 Agro Forte, Futuro Sustentável: Equilíbrio entre Produção e Meio Ambiente 🌍',
  'Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos. Um dos mais importantes é a abelha. 🐝',
  'As abelhas realizam a polinização, um processo que ajuda as plantas a produzir flores, frutos e sementes. Quando uma abelha visita uma flor, ela transporta o pólen para outras flores, permitindo que novas plantas se desenvolvam. 🌸',
  'Graças à polinização, podemos ter alimentos como:\n\n🍎 Maçã | 🍓 Morango | 🍉 Melancia\n🥒 Pepino | ☕ Café',
  'Sem as abelhas e outros polinizadores, a produção de muitos alimentos seria muito menor.\n\nPor isso, sua missão será ajudar uma abelha a coletar flores para espalhar o pólen e contribuir para a produção de alimentos! 🐝🌺',
  '🎮 Como jogar:\n\n↑ Seta para cima: subir\n↓ Seta para baixo: descer',
  'Seu objetivo é:\n\n🌸 Coletar as flores pelo caminho.\n🌽 Algumas flores representam plantas que produzem alimentos.\n⭐ Cada flor coletada ajuda na polinização e aumenta sua pontuação.',
  '⚠️ Mas atenção!\n\n🔥 Não toque no fogo.\n💨 Não toque na fumaça.\nSe a abelha encostar em um desses obstáculos, perderá energia.',
  `Quando você coletar 10 flores, ajudará a natureza e mostrará como a polinização é essencial para um agro forte e um futuro sustentável. 🌍💚`,
  'Clique na seta para começar sua missão. 🚀',
];

function avancarFalaMissao() {
  estado.indiceFalaMissao++;
  if (estado.indiceFalaMissao < falasMissao.length) {
    document.getElementById('balao-falas-missao').textContent = falasMissao[estado.indiceFalaMissao];
    if (estado.indiceFalaMissao === falasMissao.length - 1) {
      document.getElementById('seta-falas-missao').classList.add('hidden');
      document.getElementById('btn-comecar-missao1').classList.remove('hidden');
    }
  }
}

// ========== MISSÃO 1 – JOGO DA ABELHA ==========
function iniciarMissao1() {
  mostrarLogos(true);
  mostrarTela($screenMissao1);
  estado.missao1Flores = 0;
  estado.missao1Energia = 5;
  estado.missao1Ativa = true;
  estado.missao1Obstaculos = [];
  estado.missao1FloresArr = [];
  estado.missao1Velocidade = 2;
  document.getElementById('contador-flores').textContent = '0';
  document.getElementById('contador-energia').textContent = '5';
  document.getElementById('missao1-concluida').classList.add('hidden');
  document.getElementById('missao1-falha').classList.add('hidden');
  document.getElementById('missao1-concluida').style.display = 'none';
  document.getElementById('missao1-falha').style.display = 'none';

  const abelha = document.getElementById('abelha');
  const gameArea = document.getElementById('missao1-game-area');
  abelha.style.top = '50%';

  // Limpar elementos anteriores
  gameArea.querySelectorAll('.obstaculo, .flor-coletavel').forEach(el => el.remove());
  estado.missao1Obstaculos = [];
  estado.missao1FloresArr = [];

  let frameCount = 0;
  const gameLoop = setInterval(() => {
    if (!estado.missao1Ativa) {
      clearInterval(gameLoop);
      return;
    }
    frameCount++;

    if (frameCount % 50 === 0) criarFlor(gameArea);
    if (frameCount % 70 === 0) criarObstaculo(gameArea, '🔥');
    if (frameCount % 90 === 0) criarObstaculo(gameArea, '💨');

    moverElementos(gameArea, abelha, gameLoop);
    atualizarHUD();

    if (estado.missao1Flores >= 10) {
      estado.missao1Ativa = false;
      clearInterval(gameLoop);
      document.getElementById('missao1-concluida').classList.remove('hidden');
      document.getElementById('missao1-concluida').style.display = 'flex';
    }
    if (estado.missao1Energia <= 0) {
      estado.missao1Ativa = false;
      clearInterval(gameLoop);
      document.getElementById('missao1-falha').classList.remove('hidden');
      document.getElementById('missao1-falha').style.display = 'flex';
    }

    if (estado.missao1Flores >= 5) estado.missao1Velocidade = 3;
    if (estado.missao1Flores >= 8) estado.missao1Velocidade = 3.5;
  }, 30);
  estado.missao1Intervalo = gameLoop;

  document.addEventListener('keydown', controleAbelha);
}

function controleAbelha(e) {
  if (!estado.missao1Ativa) return;
  const abelha = document.getElementById('abelha');
  const gameArea = document.getElementById('missao1-game-area');
  let topAtual = parseFloat(abelha.style.top) || 50;
  const passo = 6;

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    topAtual = Math.max(5, topAtual - passo);
    abelha.style.top = topAtual + '%';
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    topAtual = Math.min(90, topAtual + passo);
    abelha.style.top = topAtual + '%';
  }
}

function criarFlor(gameArea) {
  const flor = document.createElement('div');
  flor.className = 'flor-coletavel';
  const tipos = ['🌸', '🌽', '🌾'];
  flor.textContent = tipos[Math.floor(Math.random() * tipos.length)];
  flor.style.left = '100%';
  flor.style.top = (Math.random() * 80 + 5) + '%';
  flor.dataset.coletada = 'false';
  gameArea.appendChild(flor);
  estado.missao1FloresArr.push(flor);
}

function criarObstaculo(gameArea, tipo) {
  const obs = document.createElement('div');
  obs.className = 'obstaculo';
  obs.textContent = tipo;
  obs.style.left = '100%';
  obs.style.top = (Math.random() * 80 + 5) + '%';
  obs.dataset.tipo = tipo;
  gameArea.appendChild(obs);
  estado.missao1Obstaculos.push(obs);
}

function moverElementos(gameArea, abelha, gameLoop) {
  const abelhaRect = abelha.getBoundingClientRect();

  // Flores
  const floresParaRemover = [];
  estado.missao1FloresArr.forEach((flor, idx) => {
    if (!flor.parentNode) return;
    let left = parseFloat(flor.style.left);
    left -= estado.missao1Velocidade;
    flor.style.left = left + '%';
    const florRect = flor.getBoundingClientRect();
    if (flor.dataset.coletada === 'false' && colisao(abelhaRect, florRect)) {
      flor.dataset.coletada = 'true';
      estado.missao1Flores++;
      flor.remove();
      floresParaRemover.push(idx);
      criarParticula(gameArea, florRect.left, florRect.top, '✨');
    }
    if (left < -10) {
      flor.remove();
      floresParaRemover.push(idx);
    }
  });
  estado.missao1FloresArr = estado.missao1FloresArr.filter((_, i) => !floresParaRemover.includes(i));

  // Obstáculos
  const obsParaRemover = [];
  estado.missao1Obstaculos.forEach((obs, idx) => {
    if (!obs.parentNode) return;
    let left = parseFloat(obs.style.left);
    left -= estado.missao1Velocidade;
    obs.style.left = left + '%';
    const obsRect = obs.getBoundingClientRect();
    if (colisao(abelhaRect, obsRect)) {
      estado.missao1Energia--;
      obs.remove();
      obsParaRemover.push(idx);
      criarParticula(gameArea, obsRect.left, obsRect.top, '💥');
      abelha.style.opacity = '0.4';
      setTimeout(() => { abelha.style.opacity = '1'; }, 200);
    }
    if (left < -10) {
      obs.remove();
      obsParaRemover.push(idx);
    }
  });
  estado.missao1Obstaculos = estado.missao1Obstaculos.filter((_, i) => !obsParaRemover.includes(i));
}

function colisao(r1, r2) {
  const margem = 12;
  return !(
    r1.right - margem < r2.left + margem ||
    r1.left + margem > r2.right - margem ||
    r1.bottom - margem < r2.top + margem ||
    r1.top + margem > r2.bottom - margem
  );
}

function criarParticula(gameArea, x, y, emoji) {
  const p = document.createElement('div');
  p.textContent = emoji;
  p.style.cssText = `
    position:absolute; left:${x}px; top:${y}px; font-size:20px;
    pointer-events:none; z-index:50; animation:particula-subir 0.7s ease-out forwards;
  `;
  gameArea.appendChild(p);
  setTimeout(() => p.remove(), 700);
}

function atualizarHUD() {
  document.getElementById('contador-flores').textContent = estado.missao1Flores;
  document.getElementById('contador-energia').textContent = estado.missao1Energia;
}

function reiniciarMissao1() {
  document.removeEventListener('keydown', controleAbelha);
  if (estado.missao1Intervalo) clearInterval(estado.missao1Intervalo);
  const gameArea = document.getElementById('missao1-game-area');
  gameArea.querySelectorAll('.obstaculo, .flor-coletavel').forEach(el => el.remove());
  estado.missao1Obstaculos = [];
  estado.missao1FloresArr = [];
  iniciarMissao1();
}

function concluirMissao1() {
  document.removeEventListener('keydown', controleAbelha);
  if (estado.missao1Intervalo) clearInterval(estado.missao1Intervalo);
  estado.missao1Ativa = false;
  const gameArea = document.getElementById('missao1-game-area');
  gameArea.querySelectorAll('.obstaculo, .flor-coletavel').forEach(el => el.remove());
  document.getElementById('missao1-concluida').style.display = 'none';
  document.getElementById('missao1-concluida').classList.add('hidden');
  document.getElementById('missao1-falha').style.display = 'none';
  document.getElementById('missao1-falha').classList.add('hidden');

  mostrarTela($screenFalasPosM1);
  estado.indiceFalaPosM1 = 0;
  document.getElementById('balao-pos-m1').textContent =
    `Muito bem, ${estado.nomeJogador}! 🌟 Agora vamos aprender sobre a compostagem.\n\nA compostagem transforma restos de alimentos e folhas em adubo natural, ajudando as plantas a crescerem fortes e saudáveis. 🌱`;
  document.getElementById('seta-pos-m1').classList.remove('hidden');
  document.getElementById('btn-comecar-missao2').classList.add('hidden');
  mostrarLogos(true);
}

// ========== FALAS PÓS-MISSÃO 1 ==========
const falasPosM1 = [
  `Muito bem, ${estado.nomeJogador}! 🌟 Agora vamos aprender sobre a compostagem.\n\nA compostagem transforma restos de alimentos e folhas em adubo natural, ajudando as plantas a crescerem fortes e saudáveis. 🌱`,
  'Sua missão:\n\n🧤 Arraste os materiais corretos para a composteira.\n\n✅ Pode colocar:\n🍉 Cascas de frutas\n🥕 Cascas de legumes\n🍂 Folhas secas',
  '❌ Não pode colocar:\n\n🥫 Plástico\n🪞 Vidro\n🔩 Latas\n\nSepare os resíduos corretamente e ajude a cuidar do meio ambiente! ♻️',
  'Clique em COMEÇAR para iniciar a compostagem! 🪣',
];

function avancarFalaPosM1() {
  estado.indiceFalaPosM1++;
  if (estado.indiceFalaPosM1 < falasPosM1.length) {
    document.getElementById('balao-pos-m1').textContent = falasPosM1[estado.indiceFalaPosM1];
    if (estado.indiceFalaPosM1 === falasPosM1.length - 1) {
      document.getElementById('seta-pos-m1').classList.add('hidden');
      document.getElementById('btn-comecar-missao2').classList.remove('hidden');
    }
  }
}

// ========== MISSÃO 2 – COMPOSTAGEM ==========
function iniciarMissao2() {
  mostrarLogos(true);
  mostrarTela($screenMissao2);
  estado.missao2ItensCorretos = 0;
  document.getElementById('missao2-concluida').classList.add('hidden');
  document.getElementById('missao2-concluida').style.display = 'none';
  document.querySelectorAll('#itens-compostagem .item-arrastavel').forEach(item => {
    item.style.opacity = '1';
    item.style.pointerEvents = 'auto';
    item.draggable = true;
  });
  document.getElementById('composteira-drop').classList.remove('drag-over');
}

function arrastarItem(event) {
  event.dataTransfer.setData('text/plain', event.target.closest('.item-arrastavel').dataset.item);
  event.dataTransfer.effectAllowed = 'move';
}

function soltarNaComposteira(event) {
  event.preventDefault();
  const composteira = document.getElementById('composteira-drop');
  composteira.classList.remove('drag-over');
  const itemData = event.dataTransfer.getData('text/plain');
  const itensCorretos = ['melancia', 'banana', 'maca', 'ovo'];
  const itensIncorretos = ['lata', 'metal'];

  if (itensCorretos.includes(itemData)) {
    estado.missao2ItensCorretos++;
    const itemEl = document.querySelector(`[data-item="${itemData}"]`);
    if (itemEl) {
      itemEl.style.opacity = '0.4';
      itemEl.style.pointerEvents = 'none';
      itemEl.draggable = false;
    }
    mostrarFeedbackCompostagem('✅ Item correto!', '#4CAF50');
    if (estado.missao2ItensCorretos >= estado.missao2TotalCorretos) {
      setTimeout(() => {
        document.getElementById('missao2-concluida').classList.remove('hidden');
        document.getElementById('missao2-concluida').style.display = 'flex';
      }, 600);
    }
  } else if (itensIncorretos.includes(itemData)) {
    mostrarFeedbackCompostagem('❌ Este item não pode ir na composteira!', '#f44336');
    composteira.style.transform = 'translateX(-8px)';
    setTimeout(() => { composteira.style.transform = 'translateX(8px)'; }, 100);
    setTimeout(() => { composteira.style.transform = 'translateX(0)'; }, 200);
  }
}

function mostrarFeedbackCompostagem(msg, cor) {
  let fb = document.querySelector('.feedback-compostagem');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'feedback-compostagem';
    document.getElementById('composteira-area').appendChild(fb);
  }
  fb.textContent = msg;
  fb.style.color = '#fff';
  fb.style.background = cor;
  fb.style.opacity = '1';
  fb.style.left = '50%';
  fb.style.transform = 'translateX(-50%)';
  fb.style.top = '10px';
  setTimeout(() => { fb.style.opacity = '0'; }, 1800);
}

function concluirMissao2() {
  document.getElementById('missao2-concluida').style.display = 'none';
  document.getElementById('missao2-concluida').classList.add('hidden');
  mostrarTela($screenFalasPosM2);
  estado.indiceFalaPosM2 = 0;
  document.getElementById('balao-pos-m2').textContent =
    `Parabéns, ${estado.nomeJogador}! 🎉\n\nVocê separou os resíduos corretamente e ajudou a produzir um adubo natural através da compostagem. ♻️🌱`;
  document.getElementById('seta-pos-m2').classList.remove('hidden');
  document.getElementById('btn-comecar-missao3').classList.add('hidden');
  mostrarLogos(true);
}

// ========== FALAS PÓS-MISSÃO 2 ==========
const falasPosM2 = [
  `Parabéns, ${estado.nomeJogador}! 🎉\n\nVocê separou os resíduos corretamente e ajudou a produzir um adubo natural através da compostagem. ♻️🌱`,
  'Agora o solo já está preparado e cheio de nutrientes! 🌿\n\nLembra das abelhas que ajudamos na missão anterior? Elas ajudam as plantas a produzir flores, frutos e sementes. E o adubo da compostagem ajuda essas plantas a crescerem fortes e saudáveis. 🐝🌸',
  'Sua próxima missão:\n\n🌱 Escolha uma das 3 sementes para plantar:\n\n🌽 Milho\n🍅 Tomate\n🫘 Soja',
  'Depois, regue sua plantinha com cuidado para ajudá-la a crescer. 💧\n\nCom a água, o adubo da compostagem, a luz do sol e a ajuda das abelhas, sua semente irá se desenvolver. 🌞\n\nVamos acompanhar cada etapa do crescimento! 🌱➡️🌿',
  'CLIQUE EM COMEÇAR para plantar! 🌱',
];

function avancarFalaPosM2() {
  estado.indiceFalaPosM2++;
  if (estado.indiceFalaPosM2 < falasPosM2.length) {
    document.getElementById('balao-pos-m2').textContent = falasPosM2[estado.indiceFalaPosM2];
    if (estado.indiceFalaPosM2 === falasPosM2.length - 1) {
      document.getElementById('seta-pos-m2').classList.add('hidden');
      document.getElementById('btn-comecar-missao3').classList.remove('hidden');
    }
  }
}

// ========== MISSÃO 3 – PLANTIO ==========
function iniciarMissao3() {
  mostrarLogos(true);
  mostrarTela($screenMissao3);
  document.getElementById('missao3-escolha').classList.remove('hidden');
  document.getElementById('missao3-plantio').classList.add('hidden');
  document.getElementById('missao3-crescendo').classList.add('hidden');
  document.getElementById('btn-finalizar-m3').classList.add('hidden');
  estado.sementeEscolhida = '';
}

function plantarSemente(tipo) {
  estado.sementeEscolhida = tipo;
  document.getElementById('missao3-escolha').classList.add('hidden');
  document.getElementById('missao3-plantio').classList.remove('hidden');
  document.getElementById('missao3-crescendo').classList.add('hidden');
  document.getElementById('btn-finalizar-m3').classList.add('hidden');
  document.getElementById('terra-plantio').textContent = '🟫';
}

function regarPlanta() {
  if (!estado.sementeEscolhida) return;
  document.getElementById('terra-plantio').textContent = '💧🟫';
  document.getElementById('regador-plantio').style.opacity = '0.5';
  document.getElementById('regador-plantio').style.pointerEvents = 'none';

  setTimeout(() => {
    document.getElementById('missao3-plantio').classList.add('hidden');
    document.getElementById('missao3-crescendo').classList.remove('hidden');
    const plantaFinal = document.getElementById('planta-final');
    const nomePlanta = document.getElementById('nome-planta-final');

    switch (estado.sementeEscolhida) {
      case 'milho':
        plantaFinal.textContent = '🌽';
        nomePlanta.textContent = 'Milho cresceu! (milhocresce.png)';
        break;
      case 'tomate':
        plantaFinal.textContent = '🍅';
        nomePlanta.textContent = 'Tomate cresceu! (tomatecrece.png)';
        break;
      case 'soja':
        plantaFinal.textContent = '🫘';
        nomePlanta.textContent = 'Soja cresceu! (sojacrece.png)';
        break;
    }
    document.getElementById('btn-finalizar-m3').classList.remove('hidden');
  }, 1200);
}

function finalizarMissao3() {
  mostrarTela($screenFinal);
  estado.indiceFalaFinal = 0;
  document.getElementById('balao-final').textContent =
    `Parabéns, ${estado.nomeJogador}! 🎉🏆\n\nVocê ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer. 🌱➡️🌿\n\nMuito obrigada pela sua ajuda! 🙏`;
  document.getElementById('seta-final').classList.remove('hidden');
  document.getElementById('btn-certificado').classList.add('hidden');
  mostrarLogos(true);
}

// ========== FALAS FINAIS ==========
const falasFinal = [
  `Parabéns, ${estado.nomeJogador}! 🎉🏆\n\nVocê ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer. 🌱➡️🌿\n\nMuito obrigada pela sua ajuda! 🙏`,
  'Agora você é um verdadeiro AgroHerói do Futuro Sustentável! 🦸‍♂️🌍\n\nAgro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente. 🌾💚',
  'Desenvolvido pelo aluno Matheus – 2º D Noturno\nColégio Estadual Antonio Tortato\nProfessora Patrícia Ferro\n\nFIM. 🌱🌾🐝',
];

function avancarFalaFinal() {
  estado.indiceFalaFinal++;
  if (estado.indiceFalaFinal < falasFinal.length) {
    document.getElementById('balao-final').textContent = falasFinal[estado.indiceFalaFinal];
    if (estado.indiceFalaFinal === falasFinal.length - 1) {
      document.getElementById('seta-final').classList.add('hidden');
      document.getElementById('btn-certificado').classList.remove('hidden');
      document.querySelector('#screen-final .adelita-img').style.display = 'flex';
    }
  }
}

function mostrarCertificado() {
  mostrarTela($screenCertificado);
  document.getElementById('cert-nome').textContent = estado.nomeJogador.toUpperCase();
  mostrarLogos(false);
}

// ========== INICIALIZAÇÃO ==========
function init() {
  mostrarTela($screenInicial);
  mostrarLogos(false);
  document.getElementById('input-nome-container').classList.add('hidden');
  document.getElementById('seta-avancar-ap').classList.add('hidden');
  document.getElementById('btn-comecar-missao1').classList.add('hidden');
  document.getElementById('btn-comecar-missao2').classList.add('hidden');
  document.getElementById('btn-comecar-missao3').classList.add('hidden');
  document.getElementById('btn-certificado').classList.add('hidden');
  document.getElementById('missao1-concluida').style.display = 'none';
  document.getElementById('missao1-falha').style.display = 'none';
  document.getElementById('missao2-concluida').style.display = 'none';
  document.getElementById('missao3-escolha').classList.remove('hidden');
  document.getElementById('missao3-plantio').classList.add('hidden');
  document.getElementById('missao3-crescendo').classList.add('hidden');
  document.getElementById('btn-finalizar-m3').classList.add('hidden');
}

// Suporte touch para dispositivos móveis (compostagem)
document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.item-arrastavel')) {
    e.preventDefault();
  }
}, { passive: false });

init();
console.log('🌱🐝 AgroHeróis do Futuro Sustentável - Jogo pronto!');
