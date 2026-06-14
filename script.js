// =====================================
// JOGO AGROHERÓIS - VERSÃO COMPLETA
// OBJETOS PERCORREM TODA A TELA
// =====================================

let nomeJogador = "";
let personagemEscolhido = "";
let jogoRodando = false;
let floresColetadas = 0;
let vidas = 3;
let posYAbelha = 300;
let intervaloObjetos;
let acertosCompostagem = 0;
let sementeEscolhida = "";
let audioContext;

// Elementos DOM
const telaInicial = document.getElementById("telaInicial");
const intro = document.getElementById("introducao");
const faseAbelha = document.getElementById("faseAbelha");
const textoDialogo = document.getElementById("textoDialogo");
const btnComecar = document.getElementById("btnComecar");
const btnProximo = document.getElementById("btnProximo");
const entradaNomeDiv = document.getElementById("entradaNome");
const nomeInput = document.getElementById("nomeJogador");
const escolhaPersonagemDiv = document.getElementById("escolhaPersonagem");
const menina = document.getElementById("menina");
const menino = document.getElementById("menino");
const abelhaImg = document.getElementById("abelha");
const objetosJogo = document.getElementById("objetosJogo");
const contadorFloresSpan = document.getElementById("contadorFlores");
const vidasSpan = document.getElementById("vidas");
const sucessoAbelha = document.getElementById("sucessoAbelha");
const msgSucesso = document.getElementById("msgSucesso");
const btnProxCompostagem = document.getElementById("btnProxCompostagem");
const transicaoCompostagem = document.getElementById("transicaoCompostagem");
const textoCompostagemDiv = document.getElementById("textoCompostagem");
const btnProxFalaCompostagem = document.getElementById("btnProxFalaCompostagem");
const btnIniciarCompostagem = document.getElementById("btnIniciarCompostagem");
const compostagemTela = document.getElementById("compostagemTela");
const contadorCompostagemSpan = document.getElementById("contadorCompostagem");
const transicaoPlantio = document.getElementById("transicaoPlantio");
const textoPlantioDiv = document.getElementById("textoPlantio");
const btnProxFalaPlantio = document.getElementById("btnProxFalaPlantio");
const btnIniciarPlantio = document.getElementById("btnIniciarPlantio");
const plantioTela = document.getElementById("plantioTela");
const sementes = document.querySelectorAll(".semente");
const regador = document.getElementById("regador");
const setaRegador = document.getElementById("setaRegador");
const plantinha = document.getElementById("plantinha");
const areaPlantio = document.getElementById("areaPlantio");
const telaFinal = document.getElementById("telaFinal");
const mensagemFinal = document.getElementById("mensagemFinal");
const btnCertificado = document.getElementById("btnCertificado");
const certificadoTela = document.getElementById("certificadoTela");
const nomeCertificadoSpan = document.getElementById("nomeCertificado");
const btnPDF = document.getElementById("baixarPDF");

// Sons
function tocarSom(frequencia, duracao = 0.2, tipo = "sine") {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const agora = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = frequencia;
    osc.type = tipo;
    gain.gain.setValueAtTime(0.2, agora);
    gain.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);
    osc.start(agora);
    osc.stop(agora + duracao);
    if (audioContext.state === "suspended") audioContext.resume();
}
function somColeta() { tocarSom(880, 0.15, "sine"); }
function somErro() { tocarSom(440, 0.3, "sawtooth"); }
function somAcerto() { tocarSom(660, 0.2, "sine"); }
function somConcluir() { tocarSom(523.25, 0.4, "sine"); tocarSom(659.25, 0.4, "sine"); }

// Diálogos Introdução
const falasIntroducao = [
    "Olá! Eu sou a Adelita e faço parte dos AgroHeróis!\n\nQual é o seu nome?",
    "Que nome lindo, [NOME]!\n\nHoje você vai participar de uma missão muito importante.\n\nEscolha seu personagem.",
    "UAL!!!\n\nO tema da nossa aventura é:\n\nAgro Forte, Futuro Sustentável:\nEquilíbrio entre Produção e Meio Ambiente.",
    "Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos.\n\nUm dos mais importantes é a abelha.",
    "As abelhas realizam a polinização, um processo que ajuda as plantas a produzir flores, frutos e sementes.\n\nQuando uma abelha visita uma flor, ela transporta o pólen para outras flores.",
    "Graças à polinização, podemos ter alimentos como:\n\n🍎 Maçã, 🍓 Morango, 🍉 Melancia, 🥒 Pepino, ☕ Café",
    "Sem as abelhas e outros polinizadores, a produção de muitos alimentos seria muito menor.\n\nPor isso, sua missão será ajudar uma abelha a coletar flores.",
    "Como jogar:\n\n⬆️ Seta para cima = subir\n⬇️ Seta para baixo = descer",
    "Seu objetivo é:\n\nColetar flores pelo caminho.\nCada flor ajuda na polinização e aumenta sua pontuação.",
    "Mas atenção!\n\n🚫 Não toque no fogo.\n🚫 Não toque na fumaça.\nSe encostar, perderá energia.",
    "Quando você coletar 10 flores, ajudará a natureza e mostrará como a polinização é essencial para um Agro Forte e um Futuro Sustentável.",
    "Clique para começar sua missão."
];
let falaAtual = 0;

function mostrarFalaIntroducao() {
    let texto = falasIntroducao[falaAtual].replace("[NOME]", nomeJogador);
    textoDialogo.innerText = texto;
    if (falaAtual === 0) {
        entradaNomeDiv.style.display = "block";
        escolhaPersonagemDiv.style.display = "none";
    } else if (falaAtual === 1) {
        entradaNomeDiv.style.display = "none";
        escolhaPersonagemDiv.style.display = "block";
    } else {
        entradaNomeDiv.style.display = "none";
        escolhaPersonagemDiv.style.display = "none";
    }
}

btnComecar.addEventListener("click", () => {
    telaInicial.classList.remove("ativa");
    intro.classList.add("ativa");
    mostrarFalaIntroducao();
});

btnProximo.addEventListener("click", () => {
    if (falaAtual === 0) {
        nomeJogador = nomeInput.value.trim();
        if (!nomeJogador) return alert("Digite seu nome.");
    }
    if (falaAtual === 1 && !personagemEscolhido) return alert("Escolha um personagem.");
    if (falaAtual === 11) {
        intro.classList.remove("ativa");
        iniciarFaseAbelha();
        return;
    }
    falaAtual++;
    if (falaAtual < falasIntroducao.length) mostrarFalaIntroducao();
});

menina.addEventListener("click", () => {
    personagemEscolhido = "menina";
    menina.style.border = "4px solid green";
    menino.style.border = "none";
});
menino.addEventListener("click", () => {
    personagemEscolhido = "menino";
    menino.style.border = "4px solid green";
    menina.style.border = "none";
});

// FASE ABELHA
function atualizarHUD() {
    contadorFloresSpan.innerText = `🌸 Flores: ${floresColetadas} / 10`;
    vidasSpan.innerText = `❤️ Vidas: ${vidas}`;
}

function colidiu(a, b) {
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();
    return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
}

function criarObjeto() {
    if (!jogoRodando) return;
    const objeto = document.createElement("img");
    const rand = Math.floor(Math.random() * 5);
    if (rand === 0 || rand === 1) {
        const tiposFlor = ["flor.png", "milho.png", "soja.png"];
        const florEscolhida = tiposFlor[Math.floor(Math.random() * 3)];
        objeto.src = florEscolhida;
        objeto.dataset.tipo = "flor";
    } else if (rand === 2) {
        objeto.src = "fogo.png";
        objeto.dataset.tipo = "fogo";
    } else {
        objeto.src = "fumaça.png";
        objeto.dataset.tipo = "fumaca";
    }
    objeto.classList.add("objeto");
    objeto.style.position = "absolute";
    objeto.style.width = "80px";
    objeto.style.left = window.innerWidth + "px";
    objeto.style.top = Math.random() * (window.innerHeight - 120) + 60 + "px";
    objetosJogo.appendChild(objeto);
}

function loopJogo() {
    if (!jogoRodando) return;
    const objetos = document.querySelectorAll(".objeto");
    objetos.forEach(obj => {
        let x = parseInt(obj.style.left);
        x -= 3;
        obj.style.left = x + "px";
        if (x + obj.offsetWidth < 0) obj.remove();
        if (colidiu(abelhaImg, obj)) {
            if (obj.dataset.tipo === "flor") {
                floresColetadas++;
                atualizarHUD();
                somColeta();
                obj.remove();
                if (floresColetadas >= 10) vencerFaseAbelha();
            } else {
                vidas--;
                atualizarHUD();
                somErro();
                obj.remove();
                if (vidas <= 0) perderFase();
            }
        }
    });
    requestAnimationFrame(loopJogo);
}

document.addEventListener("keydown", (e) => {
    if (!jogoRodando) return;
    if (e.key === "ArrowUp") {
        posYAbelha = Math.max(50, posYAbelha - 30);
        abelhaImg.style.top = posYAbelha + "px";
    } else if (e.key === "ArrowDown") {
        posYAbelha = Math.min(window.innerHeight - 100, posYAbelha + 30);
        abelhaImg.style.top = posYAbelha + "px";
    }
});

function iniciarFaseAbelha() {
    faseAbelha.classList.add("ativa");
    jogoRodando = true;
    floresColetadas = 0;
    vidas = 3;
    posYAbelha = window.innerHeight / 2;
    abelhaImg.style.top = posYAbelha + "px";
    atualizarHUD();
    if (intervaloObjetos) clearInterval(intervaloObjetos);
    intervaloObjetos = setInterval(criarObjeto, 2000);
    requestAnimationFrame(loopJogo);
}

function vencerFaseAbelha() {
    jogoRodando = false;
    clearInterval(intervaloObjetos);
    objetosJogo.innerHTML = "";
    faseAbelha.classList.remove("ativa");
    msgSucesso.innerText = `Parabéns ${nomeJogador}! Você ajudou as abelhas e coletou 10 flores!`;
    sucessoAbelha.classList.add("ativa");
    somConcluir();
}

function perderFase() {
    jogoRodando = false;
    clearInterval(intervaloObjetos);
    alert("❌ Você perdeu todas as vidas! O jogo vai reiniciar.");
    location.reload();
}

btnProxCompostagem.addEventListener("click", () => {
    sucessoAbelha.classList.remove("ativa");
    iniciarDialogosCompostagem();
});

// DIÁLOGOS COMPOSTAGEM
const falasCompostagem = [
    "Muito bem, [NOME]!\n\nAgora vamos aprender sobre a compostagem.\nA compostagem transforma restos de alimentos e folhas em adubo natural, ajudando as plantas a crescerem fortes e saudáveis.",
    "Sua missão:\n\nArraste os materiais corretos para a composteira.\n✅ Pode colocar: cascas de frutas, cascas de legumes, folhas secas.",
    "❌ Não pode colocar: plástico, vidro, latas.\nSepare os resíduos corretamente e ajude a cuidar do meio ambiente.",
    "Clique em COMEÇAR para iniciar a separação dos resíduos."
];
let falaCompAtual = 0;

function iniciarDialogosCompostagem() {
    transicaoCompostagem.classList.add("ativa");
    falaCompAtual = 0;
    mostrarFalaCompostagem();
    btnProxFalaCompostagem.style.display = "block";
    btnIniciarCompostagem.style.display = "none";
}

function mostrarFalaCompostagem() {
    let txt = falasCompostagem[falaCompAtual].replace("[NOME]", nomeJogador);
    textoCompostagemDiv.innerText = txt;
    if (falaCompAtual === falasCompostagem.length - 1) {
        btnProxFalaCompostagem.style.display = "none";
        btnIniciarCompostagem.style.display = "block";
    } else {
        btnProxFalaCompostagem.style.display = "block";
        btnIniciarCompostagem.style.display = "none";
    }
}

btnProxFalaCompostagem.addEventListener("click", () => {
    if (falaCompAtual < falasCompostagem.length - 1) {
        falaCompAtual++;
        mostrarFalaCompostagem();
    }
});
btnIniciarCompostagem.addEventListener("click", () => {
    transicaoCompostagem.classList.remove("ativa");
    iniciarCompostagem();
});

// FASE COMPOSTAGEM
function iniciarCompostagem() {
    compostagemTela.classList.add("ativa");
    acertosCompostagem = 0;
    contadorCompostagemSpan.innerText = `Acertos: 0 / 4`;
    const itensDrag = document.querySelectorAll("#itensCompostagem .item");
    itensDrag.forEach(item => {
        item.setAttribute("draggable", "true");
        item.style.display = "inline-block";
        item.addEventListener("dragstart", dragStart);
    });
    const composteiraImg = document.getElementById("composteira");
    composteiraImg.addEventListener("dragover", (e) => e.preventDefault());
    composteiraImg.addEventListener("drop", dropNaComposteira);
}

let dragSrc = null;
function dragStart(e) {
    dragSrc = e.target;
    e.dataTransfer.setData("text/plain", e.target.src);
}
function dropNaComposteira(e) {
    e.preventDefault();
    const itemClicado = dragSrc;
    if (!itemClicado) return;
    const isCorreto = itemClicado.getAttribute("data-correto") === "true";
    if (isCorreto) {
        acertosCompostagem++;
        contadorCompostagemSpan.innerText = `Acertos: ${acertosCompostagem} / 4`;
        itemClicado.style.display = "none";
        somAcerto();
        if (acertosCompostagem >= 4) {
            somConcluir();
            alert(`Parabéns ${nomeJogador}! Você produziu adubo natural!`);
            compostagemTela.classList.remove("ativa");
            iniciarDialogosPlantio();
        }
    } else {
        somErro();
        alert("❌ Esse material NÃO deve ir para a composteira!");
    }
    dragSrc = null;
}

// DIÁLOGOS PLANTIO
const falasPlantio = [
    "Parabéns, [NOME]!\n\nVocê separou os resíduos corretamente e ajudou a produzir um adubo natural através da compostagem.",
    "Agora o solo já está preparado e cheio de nutrientes!\nLembra das abelhas que ajudamos na missão anterior?\nElas ajudam as plantas a produzir flores, frutos e sementes.\nE o adubo da compostagem ajuda essas plantas a crescerem fortes e saudáveis.",
    "Sua próxima missão.\n\nEscolha uma das 3 sementes para plantar:\n🌽 Milho  🍅 Tomate  🌱 Soja",
    "Depois, regue sua plantinha com cuidado para ajudá-la a crescer.\nCom a água, o adubo, o sol e as abelhas, sua semente irá se desenvolver.\n\nClique em COMEÇAR."
];
let falaPlantioAtual = 0;

function iniciarDialogosPlantio() {
    transicaoPlantio.classList.add("ativa");
    falaPlantioAtual = 0;
    mostrarFalaPlantio();
    btnProxFalaPlantio.style.display = "block";
    btnIniciarPlantio.style.display = "none";
}

function mostrarFalaPlantio() {
    let txt = falasPlantio[falaPlantioAtual].replace("[NOME]", nomeJogador);
    textoPlantioDiv.innerText = txt;
    if (falaPlantioAtual === falasPlantio.length - 1) {
        btnProxFalaPlantio.style.display = "none";
        btnIniciarPlantio.style.display = "block";
    } else {
        btnProxFalaPlantio.style.display = "block";
        btnIniciarPlantio.style.display = "none";
    }
}

btnProxFalaPlantio.addEventListener("click", () => {
    if (falaPlantioAtual < falasPlantio.length - 1) {
        falaPlantioAtual++;
        mostrarFalaPlantio();
    }
});
btnIniciarPlantio.addEventListener("click", () => {
    transicaoPlantio.classList.remove("ativa");
    iniciarPlantioFase();
});

// FASE PLANTIO
function iniciarPlantioFase() {
    plantioTela.classList.add("ativa");
    sementes.forEach(s => s.style.display = "inline-block");
    regador.style.display = "none";
    plantinha.style.display = "none";
    setaRegador.style.display = "none";
    sementeEscolhida = "";
    const plantaExistente = document.getElementById("plantaFinal");
    if (plantaExistente) plantaExistente.remove();

    sementes.forEach(semente => {
        semente.addEventListener("click", function selecionar() {
            if (sementeEscolhida) return;
            sementeEscolhida = this.dataset.semente;
            sementes.forEach(s => s.style.display = "none");
            this.style.display = "block";
            alert(`🌱 Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
            regador.style.display = "block";
            setaRegador.style.display = "block";
            regador.addEventListener("click", function regar() {
                if (!sementeEscolhida) return;
                regador.style.display = "none";
                setaRegador.style.display = "none";
                plantinha.style.display = "block";
                somColeta();
                setTimeout(crescerPlanta, 2000);
            }, { once: true });
        });
    });
}

function crescerPlanta() {
    plantinha.remove();
    const plantaFinal = document.createElement("img");
    let srcPlanta = "";
    if (sementeEscolhida === "milho") srcPlanta = "milhocresce.png";
    else if (sementeEscolhida === "tomate") srcPlanta = "tomatecresce.png";
    else srcPlanta = "sojacrece.png";
    plantaFinal.src = srcPlanta;
    plantaFinal.id = "plantaFinal";
    plantaFinal.style.position = "absolute";
    plantaFinal.style.bottom = "80px";
    plantaFinal.style.left = "50%";
    plantaFinal.style.transform = "translateX(-50%)";
    plantaFinal.style.width = "100px";
    areaPlantio.appendChild(plantaFinal);
    let tamanho = 100;
    const intervalo = setInterval(() => {
        tamanho += 12;
        plantaFinal.style.width = tamanho + "px";
        if (tamanho >= 350) {
            clearInterval(intervalo);
            somConcluir();
            setTimeout(() => {
                plantioTela.classList.remove("ativa");
                mostrarTelaFinal();
            }, 1000);
        }
    }, 100);
}

function mostrarTelaFinal() {
    telaFinal.classList.add("ativa");
    mensagemFinal.innerHTML = `
        Parabéns, <strong>${nomeJogador}</strong>!<br><br>
        Você ajudou as abelhas, fez compostagem, plantou uma semente e cuidou da sua planta até ela crescer.<br><br>
        Muito obrigada pela sua ajuda!<br><br>
        Agora você é um verdadeiro <strong>AgroHerói do Futuro Sustentável</strong>.<br><br>
        Agro Forte, Futuro Sustentável: equilíbrio entre produção e meio ambiente.<br><br>
        Desenvolvido pelo aluno Matheus – 2º D Noturno<br>
        Colégio Estadual Antonio Tortato<br>
        Professora Patrícia Ferro
    `;
}

btnCertificado.addEventListener("click", () => {
    telaFinal.classList.remove("ativa");
    certificadoTela.classList.add("ativa");
    nomeCertificadoSpan.innerText = nomeJogador;
});

btnPDF.addEventListener("click", () => {
    const conteudo = `
    <html>
    <head><title>Certificado AgroHerói</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 40px; background: #f4f4f4; }
        .cert { border: 10px solid #2f9e44; background: white; padding: 40px; max-width: 800px; margin: auto; border-radius: 20px; }
        h1 { color: #2f9e44; }
        ul { text-align: left; display: inline-block; }
        .assinatura { margin-top: 30px; font-style: italic; }
    </style>
    </head>
    <body>
    <div class="cert">
        <h1>CERTIFICADO DE AGROHERÓI</h1>
        <p>A equipe dos AgroHeróis certifica que</p>
        <h2>${nomeJogador}</h2>
        <p>concluiu com sucesso todas as missões do projeto<br>
        <strong>Agro Forte, Futuro Sustentável</strong><br>
        Equilíbrio entre Produção e Meio Ambiente</p>
        <p>Demonstrando conhecimento sobre:</p>
        <ul>
            <li>Polinização e a importância das abelhas</li>
            <li>Compostagem e reciclagem de nutrientes</li>
            <li>Plantio e cuidados com as plantas</li>
            <li>Sustentabilidade e preservação ambiental</li>
        </ul>
        <h3>AGROHERÓI DO FUTURO SUSTENTÁVEL</h3>
        <div class="assinatura">Adelita – AgroHeróis</div>
    </div>
    </body>
    </html>
    `;
    const win = window.open();
    win.document.write(conteudo);
    win.document.close();
    win.print();
});

console.log("✅ Jogo AgroHeróis carregado - objetos percorrem toda a tela");
