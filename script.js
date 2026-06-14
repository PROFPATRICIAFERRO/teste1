// =====================================
// VARIÁVEIS
// =====================================

let nomeJogador = "";
let personagemEscolhido = "";

let falaAtual = 0;

const falas = [

`Olá! Eu sou a Adelita e faço parte dos AgroHeróis!

Qual é o seu nome?`,

`Que nome lindo, [NOME]!

Hoje você vai participar de uma missão muito importante.

Escolha seu personagem.`,

`UAL!!!

O tema da nossa aventura é:

Agro Forte, Futuro Sustentável:
Equilíbrio entre Produção e Meio Ambiente.`,

`Para produzir alimentos e cuidar da natureza ao mesmo tempo, precisamos da ajuda de muitos seres vivos.

Um dos mais importantes é a abelha.`,

`As abelhas realizam a polinização, um processo que ajuda as plantas a produzir flores, frutos e sementes.

Quando uma abelha visita uma flor, ela transporta o pólen para outras flores.`,

`Graças à polinização, podemos ter alimentos como:

Maçã
Morango
Melancia
Pepino
Café`,

`Sem as abelhas e outros polinizadores, a produção de muitos alimentos seria muito menor.

Por isso, sua missão será ajudar uma abelha a coletar flores.`,

`Como jogar:

↑ Seta para cima = subir

↓ Seta para baixo = descer`,

`Seu objetivo é:

Coletar flores pelo caminho.

Cada flor ajuda na polinização e aumenta sua pontuação.`,

`Mas atenção!

Não toque no fogo.

Não toque na fumaça.

Se encostar, perderá energia.`,

`Quando você coletar 10 flores, ajudará a natureza e mostrará como a polinização é essencial para um Agro Forte e um Futuro Sustentável.`,

`Clique para começar sua missão.`
];

// =====================================
// ELEMENTOS
// =====================================

const telaInicial = document.getElementById("telaInicial");
const introducao = document.getElementById("introducao");
const faseAbelha = document.getElementById("faseAbelha");

const textoDialogo = document.getElementById("textoDialogo");

const btnComecar = document.getElementById("btnComecar");
const btnProximo = document.getElementById("btnProximo");

const entradaNome = document.getElementById("entradaNome");
const nomeInput = document.getElementById("nomeJogador");

const escolhaPersonagem = document.getElementById("escolhaPersonagem");

const menina = document.getElementById("menina");
const menino = document.getElementById("menino");

// =====================================
// INICIAR JOGO
// =====================================

btnComecar.addEventListener("click", () => {
    telaInicial.classList.remove("ativa");
    introducao.classList.add("ativa");
    mostrarFala();
});

// =====================================
// MOSTRAR FALAS
// =====================================

function mostrarFala() {
    let texto = falas[falaAtual];
    texto = texto.replace("[NOME]", nomeJogador);
    textoDialogo.innerText = texto;

    if(falaAtual === 0){
        entradaNome.style.display = "block";
        escolhaPersonagem.style.display = "none";
    }
    else if(falaAtual === 1){
        entradaNome.style.display = "none";
        escolhaPersonagem.style.display = "block";
    }
    else{
        entradaNome.style.display = "none";
        escolhaPersonagem.style.display = "none";
    }
}

// =====================================
// BOTÃO PRÓXIMO
// =====================================

btnProximo.addEventListener("click", () => {
    if(falaAtual === 0){
        nomeJogador = nomeInput.value.trim();
        if(nomeJogador === ""){
            alert("Digite seu nome.");
            return;
        }
    }
    if(falaAtual === 1){
        if(personagemEscolhido === ""){
            alert("Escolha um personagem.");
            return;
        }
    }
    falaAtual++;
    if(falaAtual < falas.length){
        mostrarFala();
    }
    else{
        iniciarMissaoAbelha();
    }
});

// =====================================
// ESCOLHA PERSONAGEM
// =====================================

menina.addEventListener("click", () => {
    personagemEscolhido = "menina";
    menina.style.border = "5px solid green";
    menino.style.border = "none";
});

menino.addEventListener("click", () => {
    personagemEscolhido = "menino";
    menino.style.border = "5px solid green";
    menina.style.border = "none";
});

// =====================================
// INICIAR FASE ABELHA
// =====================================

function iniciarMissaoAbelha(){
    introducao.classList.remove("ativa");
    faseAbelha.classList.add("ativa");
    console.log("Missão da abelha iniciada.");
    iniciarFaseAbelha();
}

// =====================================
// FASE DA ABELHA
// =====================================

const abelha = document.getElementById("abelha");
const objetosJogo = document.getElementById("objetosJogo");
const contadorFlores = document.getElementById("contadorFlores");
const vidasTexto = document.getElementById("vidas");

let floresColetadas = 0;
let vidas = 3;
let posY = 300;
let jogoRodando = false;

// MOVIMENTO DA ABELHA
document.addEventListener("keydown", (e) => {
    if(!jogoRodando) return;
    if(e.key === "ArrowUp"){
        posY -= 30;
        if(posY < 50) posY = 50;
        abelha.style.top = posY + "px";
    }
    if(e.key === "ArrowDown"){
        posY += 30;
        if(posY > 600) posY = 600;
        abelha.style.top = posY + "px";
    }
});

// INICIAR FASE
function iniciarFaseAbelha(){
    jogoRodando = true;
    floresColetadas = 0;
    vidas = 3;
    atualizarHUD();
    setInterval(criarObjeto, 1200);
    requestAnimationFrame(loopJogo);
}

function atualizarHUD(){
    contadorFlores.innerHTML = `Flores: ${floresColetadas} / 10`;
    vidasTexto.innerHTML = `Vidas: ${vidas}`;
}

function criarObjeto(){
    if(!jogoRodando) return;
    const objeto = document.createElement("img");
    const sorteio = Math.floor(Math.random()*5);

    if(sorteio === 0){
        objeto.src = "assets/images/flor.png";
        objeto.dataset.tipo = "flor";
    }
    else if(sorteio === 1){
        objeto.src = "assets/images/milho.png";
        objeto.dataset.tipo = "flor";
    }
    else if(sorteio === 2){
        objeto.src = "assets/images/soja.png";
        objeto.dataset.tipo = "flor";
    }
    else if(sorteio === 3){
        objeto.src = "assets/images/fogo.png";
        objeto.dataset.tipo = "fogo";
    }
    else{
        objeto.src = "assets/images/fumaça.png";
        objeto.dataset.tipo = "fumaca";
    }

    objeto.classList.add("objeto");
    objeto.style.left = "100vw";
    objeto.style.top = Math.random()*550 + 50 + "px";
    objetosJogo.appendChild(objeto);
}

function loopJogo(){
    if(!jogoRodando) return;
    const objetos = document.querySelectorAll(".objeto");
    objetos.forEach((objeto) => {
        let posX = parseInt(objeto.style.left);
        posX -= 6;
        objeto.style.left = posX + "px";
        if(posX < -150) objeto.remove();
        if(colidiu(abelha, objeto)){
            if(objeto.dataset.tipo === "flor"){
                floresColetadas++;
                atualizarHUD();
                objeto.remove();
                if(floresColetadas >= 10) vencerFaseAbelha();
            }
            else{
                vidas--;
                atualizarHUD();
                objeto.remove();
                if(vidas <= 0) perderFase();
            }
        }
    });
    requestAnimationFrame(loopJogo);
}

function colidiu(a,b){
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();
    return !(r1.top > r2.bottom || r1.bottom < r2.top || r1.left > r2.right || r1.right < r2.left);
}

function vencerFaseAbelha(){
    jogoRodando = false;
    alert(`Parabéns ${nomeJogador}! Você coletou 10 flores!`);
    objetosJogo.innerHTML = "";
    abrirCompostagem();
}

function perderFase(){
    jogoRodando = false;
    alert("Você perdeu todas as vidas. Tente novamente.");
    location.reload();
}

function abrirCompostagem(){
    faseAbelha.classList.remove("ativa");
    document.getElementById("compostagemTela").classList.add("ativa");
    iniciarCompostagem();
}

// =====================================
// COMPOSTAGEM
// =====================================

const composteira = document.getElementById("composteira");
const itens = document.querySelectorAll(".item");
let acertosCompostagem = 0;
const itensCorretos = ["melancia.png", "banana.png", "maca.png", "ovo.png"];

function iniciarCompostagem(){
    acertosCompostagem = 0;
    itens.forEach(item => item.addEventListener("dragstart", dragStart));
    composteira.addEventListener("dragover", permitirDrop);
    composteira.addEventListener("drop", receberItem);
}

function dragStart(e){
    e.dataTransfer.setData("text", e.target.src);
}

function permitirDrop(e){
    e.preventDefault();
}

function receberItem(e){
    e.preventDefault();
    const src = e.dataTransfer.getData("text");
    const nomeArquivo = src.split("/").pop();
    if(itensCorretos.includes(nomeArquivo)){
        acertosCompostagem++;
        removerImagem(nomeArquivo);
        alert("Muito bem!");
        if(acertosCompostagem >= 4) concluirCompostagem();
    }
    else{
        alert("Esse material não deve ir para a composteira!");
    }
}

function removerImagem(nome){
    document.querySelectorAll(".item").forEach(img => {
        if(img.src.includes(nome)) img.style.display = "none";
    });
}

function concluirCompostagem(){
    alert(`Parabéns ${nomeJogador}! Você produziu adubo natural!`);
    abrirPlantio();
}

function abrirPlantio(){
    document.getElementById("compostagemTela").classList.remove("ativa");
    document.getElementById("plantioTela").classList.add("ativa");
    iniciarPlantio();
}

// =====================================
// PLANTIO
// =====================================

const sementes = document.querySelectorAll(".semente");
const regador = document.getElementById("regador");
const plantinha = document.getElementById("plantinha");
const areaPlantio = document.getElementById("areaPlantio");
let sementeEscolhida = "";

function iniciarPlantio(){
    sementes.forEach(semente => semente.addEventListener("click", selecionarSemente));
}

function selecionarSemente(){
    sementeEscolhida = this.dataset.semente;
    sementes.forEach(item => item.style.display = "none");
    this.style.display = "block";
    alert(`Você escolheu ${sementeEscolhida}! Agora regue a planta.`);
    regador.style.display = "block";
}

regador.addEventListener("click", () => {
    regador.style.display = "none";
    plantinha.style.display = "block";
    plantinha.style.width = "80px";
    setTimeout(crescerPlanta, 2000);
});

function crescerPlanta(){
    plantinha.remove();
    const plantaFinal = document.createElement("img");
    if(sementeEscolhida === "milho"){
        plantaFinal.src = "assets/images/milhocresce.png";
    }
    else if(sementeEscolhida === "tomate"){
        plantaFinal.src = "assets/images/tomatecresce.png";
    }
    else{
        plantaFinal.src = "assets/images/sojacrece.png";
    }
    plantaFinal.id = "plantaFinal";
    plantaFinal.style.position = "absolute";
    plantaFinal.style.bottom = "100px";
    plantaFinal.style.left = "50%";
    plantaFinal.style.transform = "translateX(-50%)";
    plantaFinal.style.width = "120px";
    areaPlantio.appendChild(plantaFinal);
    animarCrescimento(plantaFinal);
}

function animarCrescimento(planta){
    let tamanho = 120;
    const crescimento = setInterval(() => {
        tamanho += 10;
        planta.style.width = tamanho + "px";
        if(tamanho >= 350){
            clearInterval(crescimento);
            setTimeout(mostrarTelaFinal, 1500);
        }
    }, 150);
}

function mostrarTelaFinal(){
    document.getElementById("plantioTela").classList.remove("ativa");
    document.getElementById("telaFinal").classList.add("ativa");
    const mensagem = document.getElementById("mensagemFinal");
    mensagem.innerHTML = `
    Parabéns, <strong>${nomeJogador}</strong>!
    <br><br>
    Você ajudou as abelhas,
    fez compostagem,
    plantou uma semente
    e cuidou da sua planta até ela crescer.
    <br><br>
    Muito obrigada pela sua ajuda!
    <br><br>
    Agora você é um verdadeiro
    <strong>AgroHerói do Futuro Sustentável</strong>.
    <br><br>
    Agro Forte, Futuro Sustentável:
    equilíbrio entre produção e meio ambiente.
    <br><br>
    Desenvolvido pelo aluno
    Matheus – 2º D Noturno
    <br>
    Colégio Estadual Antonio Tortato
    <br>
    Professora Patrícia Ferro
    `;
}

document.getElementById("btnCertificado").addEventListener("click", () => {
    document.getElementById("telaFinal").classList.remove("ativa");
    document.getElementById("certificadoTela").classList.add("ativa");
    document.getElementById("nomeCertificado").innerHTML = nomeJogador;
});

// =====================================
// CERTIFICADO
// =====================================

const btnPDF = document.getElementById("baixarPDF");

btnPDF.addEventListener("click", () => {
    gerarPDF();
});

function gerarPDF(){
    const janela = window.open("", "_blank");
    janela.document.write(`
    <html>
    <head>
    <title>Certificado AgroHerói</title>
    <style>
    body{ font-family:Arial; text-align:center; padding:50px; background:#f4f4f4; }
    .certificado{ border:8px solid green; background:white; padding:50px; max-width:900px; margin:auto; }
    h1{ color:#2f9e44; margin-bottom:30px; }
    h2{ margin-top:25px; margin-bottom:25px; }
    p{ font-size:22px; line-height:1.8; }
    ul{ text-align:left; display:inline-block; font-size:22px; margin-top:20px; }
    .titulo{ font-size:30px; color:#2f9e44; margin-top:30px; font-weight:bold; }
    .assinatura{ margin-top:50px; font-size:22px; }
    </style>
    </head>
    <body>
        <div class="certificado">
            <h1>CERTIFICADO DE AGROHERÓI</h1>
            <p>A equipe dos AgroHeróis certifica que</p>
            <h2>${nomeJogador}</h2>
            <p>concluiu com sucesso todas as missões do projeto<br><br>
            Agro Forte, Futuro Sustentável:<br>
            Equilíbrio entre Produção e Meio Ambiente</p>
            <br>
            <p>Demonstrando conhecimento sobre:</p>
            <ul>
                <li>Polinização e a importância das abelhas</li>
                <li>Compostagem e reciclagem de nutrientes</li>
                <li>Plantio e cuidados com as plantas</li>
                <li>Sustentabilidade e preservação ambiental</li>
            </ul>
            <div class="titulo">AGROHERÓI DO FUTURO SUSTENTÁVEL</div>
            <div class="assinatura">Adelita - AgroHeróis</div>
        </div>
    </body>
    </html>
    `);
    janela.document.close();
    setTimeout(() => janela.print(), 1000);
}

console.log("Projeto AgroHeróis carregado com sucesso!");
