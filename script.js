(function() {
  // ========== ELEMENTOS ==========
  const screens = {
    start: document.getElementById('screen-start'),
    dialogue: document.getElementById('screen-dialogue'),
    bee: document.getElementById('screen-bee'),
    compost: document.getElementById('screen-compost'),
    cert: document.getElementById('screen-cert')
  };
  const speechText = document.getElementById('speech-text');
  const arrow = document.getElementById('arrow');
  const charImg = document.getElementById('char-img');
  const nameArea = document.getElementById('name-area');
  const nameInput = document.getElementById('name-input');
  const btnOk = document.getElementById('btn-ok');
  const charOptions = document.getElementById('char-options');
  const seedsRow = document.getElementById('seeds-row');
  const plantStage = document.getElementById('plant-stage');
  const plantImg = document.getElementById('plant-img');
  const waterCan = document.getElementById('water-can');
  const beeCanvas = document.getElementById('beeCanvas');
  const ctx = beeCanvas.getContext('2d');
  const flowerCountEl = document.getElementById('flower-count');
  const energyEl = document.getElementById('energy-display');
  const compostBin = document.getElementById('compost-bin');
  const itemsContainer = document.getElementById('items-container');
  const correctSpan = document.getElementById('correct-count');
  const wrongSpan = document.getElementById('wrong-count');
  const feedback = document.getElementById('compost-feedback');
  const certName = document.getElementById('cert-name');

  // ========== ESTADO ==========
  let playerName = '', currentPhase = 0, dialogueQueue = [], dialogueIdx = 0;
  let selectedSeed = null, plantWatered = false;
  let compostCorrect = 0, compostWrong = 0;
  let beeActive = false, beeFlowers = 0, beeEnergy = 5, beeAnim = null;
  const bee = { x:120, y:300, w:50, h:40 };
  let objects = [], frame = 0;

  // Imagens do jogo da abelha
  const imgs = {
    abelha: new Image(),
    soja: new Image(),
    milho: new Image(),
    flor: new Image(),
    fogo: new Image(),
    fumaca: new Image()
  };
  imgs.abelha.src = 'B.png';
  imgs.soja.src = 'soja.png';
  imgs.milho.src = 'milho.png';
  imgs.flor.src = 'flor.png';
  imgs.fogo.src = 'fogo.png';
  imgs.fumaca.src = 'fumaca.png';

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  // ========== DIÁLOGO ==========
  function setupDialogue(phase, dialogues, imgSrc, showLogos=true, showChars=false, showSeeds=false, showPlant=false) {
    currentPhase = phase; dialogueQueue = dialogues; dialogueIdx = 0;
    charImg.src = imgSrc || 'principal1.png';
    document.getElementById('logos').style.display = showLogos ? 'flex' : 'none';
    charOptions.style.display = showChars ? 'flex' : 'none';
    seedsRow.style.display = showSeeds ? 'flex' : 'none';
    plantStage.style.display = showPlant ? 'flex' : 'none';
    waterCan.style.display = 'none';
    nameArea.style.display = 'none';
    arrow.style.display = 'block';
    showScreen('dialogue');
    displayDialogue();
  }

  function displayDialogue() {
    if (dialogueIdx < dialogueQueue.length) {
      speechText.textContent = dialogueQueue[dialogueIdx].replace(/\[NOME\]/g, playerName || 'Aventureiro');
      arrow.style.display = 'block';
    } else {
      arrow.style.display = 'none';
      handlePhaseComplete();
    }
  }

  function advanceDialogue() { dialogueIdx++; displayDialogue(); }

  arrow.addEventListener('click', advanceDialogue);
  speechText.parentElement.addEventListener('click', (e) => {
    if (e.target !== nameInput && e.target !== btnOk) advanceDialogue();
  });

  btnOk.addEventListener('click', () => {
    const n = nameInput.value.trim();
    if (n) { playerName = n; nameArea.style.display = 'none'; advanceDialogue(); }
  });
  nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') btnOk.click(); });

  function handlePhaseComplete() {
    switch(currentPhase) {
      case 0:
        charOptions.style.display = 'flex';
        speechText.textContent = 'Escolha seu personagem:';
        arrow.style.display = 'none';
        break;
      case 1: startMissionDialogue(); break;
      case 2: startBeeGame(); break;
      case 3: startCompostGame(); break;
      case 4:
        seedsRow.style.display = 'flex';
        plantStage.style.display = 'none';
        waterCan.style.display = 'none';
        selectedSeed = null; plantWatered = false;
        speechText.textContent = 'Escolha uma semente para plantar:';
        arrow.style.display = 'none';
        break;
      case 5: showCertificate(); break;
    }
  }

  // Personagens
  document.getElementById('pick-girl').onclick = () => {
    charOptions.style.display = 'none';
    currentPhase = 1;
    startMissionDialogue();
  };
  document.getElementById('pick-boy').onclick = () => {
    charOptions.style.display = 'none';
    currentPhase = 1;
    startMissionDialogue();
  };

  function startMissionDialogue() {
    setupDialogue(2, [
      'UAL!!! O tema da nossa aventura é: Agro Forte, Futuro Sustentável.',
      'Precisamos das abelhas! Elas fazem a polinização, que permite termos frutos e sementes.',
      'Graças à polinização, temos alimentos como maçã, morango, melancia, pepino, café.',
      'Sua missão: ajude uma abelha a coletar 10 flores, desviando do fogo e da fumaça.',
      'Controles: ↑ sobe, ↓ desce.',
      'Clique na seta para começar! 🐝'
    ], 'principal1.png', true, false, false, false);
  }

  // ========== JOGO DA ABELHA ==========
  function startBeeGame() {
    showScreen('bee'); beeFlowers = 0; beeEnergy = 5; beeActive = true;
    flowerCountEl.textContent = '0'; energyEl.textContent = '5';
    resizeCanvas(); objects = []; frame = 0;
    for (let i=0; i<12; i++) spawnObj(beeCanvas.width + Math.random()*600);
    if (beeAnim) cancelAnimationFrame(beeAnim);
    beeLoop();
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

    // colisões
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
    beeActive = false; if (beeAnim) cancelAnimationFrame(beeAnim);
    if (success) {
      setupDialogue(3, [
        'Muito bem, [NOME]! Agora vamos aprender sobre compostagem.',
        'A compostagem transforma restos de alimentos em adubo natural.',
        'Arraste os materiais corretos para a composteira. Pode: cascas de frutas, legumes, folhas secas. Não pode: plástico, vidro, latas.',
        'Clique na seta para começar! 🗑️'
      ], 'principal2.png', true, false, false, false);
    } else {
      alert('A abelha perdeu a energia! Tente novamente.');
      startBeeGame();
    }
  }

  // Controles
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

  // ========== COMPOSTAGEM ==========
  function startCompostGame() {
    showScreen('compost'); compostCorrect = 0; compostWrong = 0;
    correctSpan.textContent = '0'; wrongSpan.textContent = '0'; feedback.textContent = '';
    itemsContainer.innerHTML = '';
    const items = [
      { id:'melancia', img:'melancia.png', lbl:'Melancia', ok:true },
      { id:'bana', img:'bana.png', lbl:'Banana', ok:true },
      { id:'maca', img:'maca.png', lbl:'Maçã', ok:true },
      { id:'ovo', img:'ovo.png', lbl:'Ovo (casca)', ok:true },
      { id:'lata', img:'lata.png', lbl:'Lata', ok:false },
      { id:'metal', img:'metal.png', lbl:'Metal', ok:false }
    ].sort(()=>Math.random()-0.5);
    items.forEach(it => {
      const div = document.createElement('div'); div.className = 'drag-item'; div.draggable = true;
      div.dataset.id = it.id; div.dataset.ok = it.ok;
      div.innerHTML = `<img src="${it.img}"><span class="lbl">${it.lbl}</span>`;
      div.addEventListener('dragstart', (e)=>{ div.style.opacity='0.6'; e.dataTransfer.setData('text/plain', it.id); });
      div.addEventListener('dragend', ()=>{ div.style.opacity='1'; });
      itemsContainer.appendChild(div);
    });
  }

  compostBin.addEventListener('dragover', e => { e.preventDefault(); compostBin.classList.add('highlight'); });
  compostBin.addEventListener('dragleave', () => compostBin.classList.remove('highlight'));
  compostBin.addEventListener('drop', e => {
    e.preventDefault(); compostBin.classList.remove('highlight');
    processDrop(e.dataTransfer.getData('text/plain'));
  });

  // Suporte touch
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

  function processDrop(id) {
    const el = itemsContainer.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    const ok = el.dataset.ok === 'true';
    if (ok) {
      compostCorrect++; correctSpan.textContent = compostCorrect;
      feedback.textContent = '✅ Correto!'; feedback.style.color = '#a5d6a7';
    } else {
      compostWrong++; wrongSpan.textContent = compostWrong;
      feedback.textContent = '❌ Errado!'; feedback.style.color = '#ef9a9a';
    }
    el.style.opacity = '0.3'; el.draggable = false; el.style.pointerEvents = 'none';
    if (compostCorrect >= 4) {
      feedback.textContent = '🌟 Compostagem concluída!';
      setTimeout(() => {
        setupDialogue(4, [
          'Parabéns, [NOME]! Você separou os resíduos corretamente.',
          'Agora o solo está preparado. Escolha uma semente para plantar.',
          'Depois, regue sua plantinha. Clique na seta. 🌱'
        ], 'principal1.png', true, false, false, false);
      }, 1500);
    }
  }

  // ========== PLANTIO ==========
  document.querySelectorAll('.seed-card').forEach(card => {
    card.addEventListener('click', function() {
      if (currentPhase !== 4) return;
      selectedSeed = this.dataset.seed;
      document.querySelectorAll('.seed-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      seedsRow.style.display = 'none';
      plantStage.style.display = 'flex';
      plantImg.src = 'terra.png';
      waterCan.style.display = 'flex';
      speechText.textContent = 'Clique no regador para regar!';
      arrow.style.display = 'none';
    });
  });

  waterCan.addEventListener('click', () => {
    if (!selectedSeed || plantWatered) return;
    plantWatered = true;
    plantImg.src = 'regua.png';
    waterCan.style.display = 'none';
    speechText.textContent = 'Regando...';
    setTimeout(() => {
      plantImg.src = 'plantinha.png';
      speechText.textContent = 'Germinou!';
      setTimeout(() => {
        const grown = { milho:'milhocresce.png', tomate:'tomatecrece.png', soja:'sojacrece.png' };
        plantImg.src = grown[selectedSeed];
        speechText.textContent = 'Sua planta cresceu forte! Clique na seta.';
        arrow.style.display = 'block';
        currentPhase = 4.5;
      }, 1500);
    }, 1200);
  });

  // ========== FINAL ==========
  function showCertificate() {
    showScreen('cert');
    certName.textContent = playerName || 'Aventureiro';
  }

  // Override para avançar após plantio
  const origAdvance = advanceDialogue;
  advanceDialogue = function() {
    if (currentPhase === 4.5) { startFinal(); return; }
    if (currentPhase === 4 && seedsRow.style.display === 'flex') return;
    origAdvance();
  };

  function startFinal() {
    setupDialogue(5, [
      'Parabéns, [NOME]! Você ajudou as abelhas, fez compostagem e plantou.',
      'Agora você é um verdadeiro AgroHerói do Futuro Sustentável!',
      'Agro Forte, Futuro Sustentável.',
      'Desenvolvido por Matheus – 2º D | Colégio Antonio Tortato | Profª Patrícia Ferro | FIM. 🌱🌾'
    ], 'principal3.png', true, false, false, false);
  }

  // ========== INÍCIO ==========
  document.getElementById('btn-start').addEventListener('click', () => {
    setupDialogue(0, [
      'Olá! Eu sou a Adelita e faço parte dos AgroHeróis! Qual é o seu nome?',
      'Que nome lindo, [NOME]! Escolha seu personagem.'
    ], 'principal1.png', true, false, false, false);
    nameArea.style.display = 'flex'; arrow.style.display = 'none';
    nameInput.value = ''; nameInput.focus();
  });

  // Ajuste inicial do canvas
  setTimeout(resizeCanvas, 100);
})();
