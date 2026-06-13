// ---------- ESTADO GLOBAL ----------
let playerName = '';
let unlockedStages = [1]; // estágios desbloqueados (índices 1 a 5)
let currentDialogueIndex = 0;
let dialogueLines = [];
let selectedSeed = null;
let plantWatered = false;

// ---------- ELEMENTOS ----------
const tabs = document.querySelectorAll('.tab');
const stages = document.querySelectorAll('.stage');
const speechText = document.getElementById('speech-text');
const nameArea = document.getElementById('name-area');
const nameInput = document.getElementById('name-input');
const btnOk = document.getElementById('btn-ok');
const btnNextDialogue = document.getElementById('btn-next-dialogue');
const charOptions = document.getElementById('char-options');
const charImg = document.getElementById('char-img');
const btnBeeDone = document.getElementById('btn-bee-done');
const btnCompostDone = document.getElementById('btn-compost-done');
const btnPlantDone = document.getElementById('btn-plant-done');
const seedsRow = document.getElementById('seeds-row');
const plantStage = document.getElementById('plant-stage');
const plantImg = document.getElementById('plant-img');
const waterCan = document.getElementById('water-can');
const compostBin = document.getElementById('compost-bin');
const itemsContainer = document.getElementById('items-container');
const correctSpan = document.getElementById('correct-count');
const wrongSpan = document.getElementById('wrong-count');
const compostFeedback = document.getElementById('compost-feedback');
const certName = document.getElementById('cert-name');

// ---------- ATUALIZAR ABAS ----------
function updateTabs() {
  tabs.forEach(tab => {
    const s = parseInt(tab.dataset.stage);
    if (unlockedStages.includes(s)) {
      tab.disabled = false;
      tab.classList.add('active');
    } else {
      tab.disabled = true;
      tab.classList.remove('active');
    }
  });
}

// ---------- NAVEGAÇÃO ENTRE ESTÁGIOS ----------
function goToStage(num) {
  if (!unlockedStages.includes(num)) return;
  stages.forEach(stage => stage.classList.remove('active'));
  document.getElementById(`stage-${num}`).classList.add('active');
  updateTabs();
  // Inicializa conteúdo específico se necessário
  if (num === 2) initBeeGame();
  if (num === 3) initCompostGame();
  if (num === 4) resetPlanting();
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const stage = parseInt(tab.dataset.stage);
    if (unlockedStages.includes(stage)) goToStage(stage);
  });
});

// ---------- ETAPA 1: DIÁLOGO ----------
const dialoguesPhase1 = [
  "Olá! Eu sou a Adelita e faço parte dos AgroHeróis! Qual é o seu nome?",
  "Que nome lindo, [NOME]! Hoje você vai participar de uma missão muito importante. Escolha seu personagem clicando nele."
];

function startStage1() {
  currentDialogueIndex = 0;
  dialogueLines = dialoguesPhase1.slice();
  charImg.src = 'principal1.png';
  nameArea.style.display = 'none';
  charOptions.style.display = 'none';
  btnNextDialogue.style.display = 'none';
  goToStage(1);
  showDialogue();
}

function showDialogue() {
  if (currentDialogueIndex < dialogueLines.length) {
    let text = dialogueLines[currentDialogueIndex].replace(/\[NOME\]/g, playerName || 'Aventureiro');
    speechText.textContent = text;
    if (currentDialogueIndex === 0) {
      nameArea.style.display = 'flex';
      btnNextDialogue.style.display = 'none';
      nameInput.value = '';
      nameInput.focus();
    } else {
      nameArea.style.display = 'none';
      btnNextDialogue.style.display = 'block';
    }
  } else {
    // fim do diálogo
    btnNextDialogue.style.display = 'none';
    unlockStage(2);
    goToStage(1); // fica na etapa 1, mas mostra opção de ir para próxima
  }
}

btnNextDialogue.addEventListener('click', () => {
  currentDialogueIndex++;
  showDialogue();
});

btnOk.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    playerName = name;
    nameArea.style.display = 'none';
    currentDialogueIndex = 1;
    showDialogue();
  }
});

document.getElementById('pick-girl').addEventListener('click', () => {
  charOptions.style.display = 'none';
  currentDialogueIndex = 2; // avança para após escolha
  dialogueLines = dialoguesPhase1; // já terminou
  // inicia missão explicação
  startMissionExplanation();
});
document.getElementById('pick-boy').addEventListener('click', () => {
  charOptions.style.display = 'none';
  currentDialogueIndex = 2;
  startMissionExplanation();
});

function startMissionExplanation() {
  dialogueLines = [
    "UAL!!! O tema da nossa aventura é: Agro Forte, Futuro Sustentável.",
    "Precisamos das abelhas! Elas fazem a polinização, que permite termos frutos e sementes.",
    "Graças à polinização, temos alimentos como maçã, morango, melancia, pepino, café.",
    "Sua missão: ajude uma abelha a coletar 10 flores, desviando do fogo e da fumaça.",
    "Controles: ↑ sobe, ↓ desce.",
    "Clique no botão abaixo para começar a missão da abelha!"
  ];
  currentDialogueIndex = 0;
  charOptions.style.display = 'none';
  showDialogueWithNext();
}

function showDialogueWithNext() {
  if (currentDialogueIndex < dialogueLines.length) {
    speechText.textContent = dialogueLines[currentDialogueIndex].replace(/\[NOME\]/g, playerName);
    btnNextDialogue.style.display = 'block';
    nameArea.style.display = 'none';
  } else {
    btnNextDialogue.style.display = 'none';
    unlockStage(2);
    // mostra botão extra?
    speechText.textContent = 'Agora clique na aba "2. Abelha" para jogar!';
  }
}

btnNextDialogue.addEventListener('click', () => {
  currentDialogueIndex++;
  showDialogueWithNext();
});

function unlockStage(num) {
  if (!unlockedStages.includes(num)) {
    unlockedStages.push(num);
    updateTabs();
  }
}

// ========== ETAPA 2: JOGO DA ABELHA ==========
const beeCanvas = document.getElementById('beeCanvas');
const ctx = beeCanvas.getContext('2d');
const flowerCountEl = document.getElementById('flower-count');
const energyEl = document.getElementById('energy-display');
let beeActive = false, beeFlowers = 0, beeEnergy = 5, beeAnim;
const bee = { x:120, y:300, w:50, h:40 };
let objects = [], frame = 0;
const imgs = {
  abelha: new Image(), soja: new Image(), milho: new Image(),
  flor: new Image(), fogo: new Image(), fumaca: new Image()
};
imgs.abelha.src = 'B.png';
imgs.soja.src = 'soja.png'; imgs.milho.src = 'milho.png'; imgs.flor.src = 'flor.png';
imgs.fogo.src = 'fogo.png'; imgs.fumaca.src = 'fumaca.png';

function initBeeGame() {
  resizeCanvas();
  beeFlowers = 0; beeEnergy = 5; beeActive = true;
  flowerCountEl.textContent = '0'; energyEl.textContent = '5';
  objects = []; frame = 0;
  for (let i=0; i<12; i++) spawnObj(beeCanvas.width + Math.random()*600);
  if (beeAnim) cancelAnimationFrame(beeAnim);
  beeLoop();
  btnBeeDone.style.display = 'none';
}

function resizeCanvas() {
  beeCanvas.width = beeCanvas.clientWidth || 800;
  beeCanvas.height = beeCanvas.clientHeight || 500;
}
window.addEventListener('resize', resizeCanvas);

function spawnObj(startX) {
  const types = ['flower','flower','flower','fire','smoke','flower','fire','smoke'];
  const type = types[Math.floor(Math.random()*types.length)];
  objects.push({
    type, x: startX || beeCanvas.width+Math.random()*200,
    y: 40 + Math.random()*(beeCanvas.height-100),
    w: type==='flower'?35:40, h: type==='flower'?35:45,
    speed: 2.5 + Math.random()*1.5, collected: false,
    variant: type==='flower' ? ['soja','milho','flor'][Math.floor(Math.random()*3)] : null
  });
}

function beeLoop() {
  if (!beeActive) return;
  resizeCanvas(); frame++;
  objects.forEach(o => o.x -= o.speed);
  objects = objects.filter(o => o.x > -80);
  if (frame%40===0 && objects.length<15) spawnObj(beeCanvas.width+150);

  for (let o of objects) {
    if (o.collected) continue;
    if (bee.x < o.x+o.w && bee.x+bee.w > o.x &&
        bee.y < o.y+o.h && bee.y+bee.h > o.y) {
      o.collected = true;
      if (o.type === 'flower') {
        beeFlowers++; flowerCountEl.textContent = beeFlowers;
        if (beeFlowers >= 10) { endBeeGame(true); return; }
      } else {
        beeEnergy--; energyEl.textContent = Math.max(0, beeEnergy);
        if (beeEnergy <= 0) { endBeeGame(false); return; }
      }
    }
  }

  ctx.clearRect(0,0,beeCanvas.width,beeCanvas.height);
  objects.forEach(o => {
    if (o.collected) return;
    const img = o.type==='flower' ? imgs[o.variant] : (o.type==='fire' ? imgs.fogo : imgs.fumaca);
    if (img.complete) ctx.drawImage(img, o.x-o.w/2, o.y-o.h/2, o.w, o.h);
  });
  if (imgs.abelha.complete) ctx.drawImage(imgs.abelha, bee.x-bee.w/2, bee.y-bee.h/2, bee.w, bee.h);
  beeAnim = requestAnimationFrame(beeLoop);
}

function endBeeGame(success) {
  beeActive = false;
  if (beeAnim) cancelAnimationFrame(beeAnim);
  if (success) {
    btnBeeDone.style.display = 'block';
    btnBeeDone.onclick = () => {
      unlockStage(3);
      goToStage(3);
    };
  } else {
    alert('A abelha perdeu energia! Tente novamente.');
    initBeeGame();
  }
}

document.addEventListener('keydown', (e) => {
  if (!beeActive) return;
  if (e.key==='ArrowUp') { bee.y = Math.max(40, bee.y-15); e.preventDefault(); }
  if (e.key==='ArrowDown') { bee.y = Math.min(beeCanvas.height-40, bee.y+15); e.preventDefault(); }
});
beeCanvas.addEventListener('touchmove', (e) => {
  if (!beeActive) return;
  const rect = beeCanvas.getBoundingClientRect();
  bee.y = Math.max(40, Math.min(beeCanvas.height-40, e.touches[0].clientY - rect.top));
  e.preventDefault();
});

// ========== ETAPA 3: COMPOSTAGEM ==========
let compostCorrect = 0, compostWrong = 0;

function initCompostGame() {
  compostCorrect = 0; compostWrong = 0;
  correctSpan.textContent = '0'; wrongSpan.textContent = '0';
  compostFeedback.textContent = '';
  itemsContainer.innerHTML = '';
  btnCompostDone.style.display = 'none';
  const items = [
    { id:'melancia', img:'melancia.png', lbl:'Melancia', ok:true },
    { id:'bana', img:'bana.png', lbl:'Banana', ok:true },
    { id:'maca', img:'maca.png', lbl:'Maçã', ok:true },
    { id:'ovo', img:'ovo.png', lbl:'Ovo (casca)', ok:true },
    { id:'lata', img:'lata.png', lbl:'Lata', ok:false },
    { id:'metal', img:'metal.png', lbl:'Metal', ok:false }
  ].sort(()=>Math.random()-0.5);
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'drag-item';
    div.draggable = true;
    div.dataset.id = it.id;
    div.dataset.ok = it.ok;
    div.innerHTML = `<img src="${it.img}"><span>${it.lbl}</span>`;
    div.addEventListener('dragstart', (e)=>{ div.style.opacity='0.6'; e.dataTransfer.setData('text/plain', it.id); });
    div.addEventListener('dragend', (e)=>{ div.style.opacity='1'; });
    itemsContainer.appendChild(div);
  });
  setupCompostEvents();
}

function setupCompostEvents() {
  compostBin.addEventListener('dragover', e => { e.preventDefault(); compostBin.classList.add('highlight'); });
  compostBin.addEventListener('dragleave', () => compostBin.classList.remove('highlight'));
  compostBin.addEventListener('drop', e => {
    e.preventDefault();
    compostBin.classList.remove('highlight');
    processDrop(e.dataTransfer.getData('text/plain'));
  });
  // Touch
  let touchItem = null;
  itemsContainer.addEventListener('touchstart', e => {
    const item = e.target.closest('.drag-item');
    if (item) { touchItem = item; item.style.opacity = '0.6'; }
  }, {passive:false});
  itemsContainer.addEventListener('touchend', e => {
    if (!touchItem) return;
    const touch = e.changedTouches[0];
    const binRect = compostBin.getBoundingClientRect();
    if (touch.clientX > binRect.left && touch.clientX < binRect.right &&
        touch.clientY > binRect.top && touch.clientY < binRect.bottom) {
      processDrop(touchItem.dataset.id);
    }
    touchItem.style.opacity = '1';
    touchItem = null;
    compostBin.classList.remove('highlight');
  });
}

function processDrop(id) {
  const el = itemsContainer.querySelector(`[data-id="${id}"]`);
  if (!el) return;
  const ok = el.dataset.ok === 'true';
  if (ok) {
    compostCorrect++; correctSpan.textContent = compostCorrect;
    compostFeedback.textContent = '✅ Correto!';
  } else {
    compostWrong++; wrongSpan.textContent = compostWrong;
    compostFeedback.textContent = '❌ Errado!';
  }
  el.style.opacity = '0.3'; el.draggable = false;
  if (compostCorrect >= 4) {
    compostFeedback.textContent = '🌟 Compostagem concluída!';
    btnCompostDone.style.display = 'block';
    btnCompostDone.onclick = () => {
      unlockStage(4);
      goToStage(4);
    };
  }
}

// ========== ETAPA 4: PLANTIO ==========
function resetPlanting() {
  seedsRow.style.display = 'flex';
  plantStage.style.display = 'none';
  waterCan.style.display = 'none';
  btnPlantDone.style.display = 'none';
  selectedSeed = null;
  plantWatered = false;
  document.querySelectorAll('.seed-card').forEach(c => c.classList.remove('selected'));
}

document.querySelectorAll('.seed-card').forEach(card => {
  card.addEventListener('click', function() {
    if (selectedSeed) return;
    selectedSeed = this.dataset.seed;
    this.classList.add('selected');
    seedsRow.style.display = 'none';
    plantStage.style.display = 'flex';
    plantImg.src = 'terra.png';
    waterCan.style.display = 'flex';
  });
});

waterCan.addEventListener('click', () => {
  if (!selectedSeed || plantWatered) return;
  plantWatered = true;
  plantImg.src = 'regua.png';
  waterCan.style.display = 'none';
  setTimeout(() => {
    plantImg.src = 'plantinha.png';
    setTimeout(() => {
      const grown = { milho:'milhocresce.png', tomate:'tomatecrece.png', soja:'sojacrece.png' };
      plantImg.src = grown[selectedSeed];
      btnPlantDone.style.display = 'block';
      btnPlantDone.onclick = () => {
        unlockStage(5);
        goToStage(5);
        certName.textContent = playerName || 'Aventureiro';
      };
    }, 1500);
  }, 1200);
});

// ---------- INICIALIZAÇÃO ----------
updateTabs();
goToStage(1);
startStage1();
