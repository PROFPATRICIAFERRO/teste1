* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

body {
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #1a3c2c;
}

/* TELAS */
.tela {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    opacity: 0;
    transition: opacity 0.5s ease;
}
.tela.ativa {
    display: block;
    opacity: 1;
}

/* FUNDO PADRÃO PARA OUTRAS TELAS */
.fundo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
}

/* FUNDO DA TELA INICIAL - SEM CORTE */
.fundo-inicial-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1a3c2c;
    display: flex;
    align-items: center;
    justify-content: center;
}
.fundo-inicial {
    width: 100%;
    height: 100%;
    background-image: url('3.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

/* LOGOS TELA INICIAL */
.logos-iniciais {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
    display: flex;
    gap: 20px;
}
.logo-animada {
    height: 80px;
    animation: pulsarBrilho 1.5s ease-in-out infinite;
    filter: drop-shadow(0 0 5px gold);
}
@keyframes pulsarBrilho {
    0% { transform: scale(1); filter: drop-shadow(0 0 2px gold); }
    50% { transform: scale(1.08); filter: drop-shadow(0 0 20px #ffd700); }
    100% { transform: scale(1); filter: drop-shadow(0 0 2px gold); }
}

/* LOGOS OUTRAS TELAS */
.logos {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 10;
    display: flex;
    gap: 15px;
}
.logos img {
    height: 80px;
    filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.3));
}

/* RODAPÉ */
.rodape {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #2f9e44;
    color: white;
    text-align: center;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    z-index: 20;
    border-top: 2px solid #1e6b2f;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
}
.rodape p {
    margin: 2px 0;
}

/* BOTÕES */
.botao {
    background: #2f9e44;
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 60px;
    cursor: pointer;
    font-size: 28px;
    font-weight: bold;
    transition: transform 0.2s, background 0.2s;
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    z-index: 30;
}
.botao:hover {
    transform: scale(1.05);
    background: #1e6b2f;
}
.centro {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 30;
}

/* PERSONAGEM ADELITA */
.adelita {
    position: absolute;
    left: 30px;
    bottom: 20px;
    height: 480px;
    z-index: 5;
    filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.3));
}

/* CAIXA DE DIÁLOGO */
.caixaDialogo {
    position: absolute;
    left: 320px;
    bottom: 40px;
    width: 550px;
    min-height: 220px;
    background: rgba(255,255,255,0.97);
    border-radius: 30px;
    padding: 25px;
    z-index: 20;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    backdrop-filter: blur(5px);
}
#textoDialogo {
    font-size: 24px;
    line-height: 1.4;
    color: #1e3a2f;
    margin-bottom: 20px;
}
.seta {
    position: absolute;
    right: 20px;
    bottom: 15px;
    background: #2f9e44;
    color: white;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    font-size: 28px;
    cursor: pointer;
    border: none;
}
.seta:hover {
    transform: scale(1.1);
}
#entradaNome {
    margin-top: 20px;
}
#nomeJogador {
    width: 100%;
    padding: 12px;
    font-size: 20px;
    border-radius: 40px;
    border: 2px solid #ccc;
}
#escolhaPersonagem {
    display: none;
    text-align: center;
}
.personagemEscolha {
    width: 180px;
    margin: 10px;
    cursor: pointer;
}
.personagemEscolha:hover {
    transform: scale(1.08);
}

/* FASE ABELHA (mantenha o restante do CSS que você já tinha) */
/* ... adicione aqui os estilos para as outras fases (compostagem, plantio, certificado) ... */
/* Para não repetir, reutilize o CSS anterior que funcionava para essas fases */
