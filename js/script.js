document.addEventListener("DOMContentLoaded", function () {
  const bgMusic = document.querySelector("#bg-music");
  const controlIcon = document.querySelector("#control-icon");
  const jogarButton = document.getElementById("jogar");
  const regrasButton = document.getElementById("regras");

  // Configuração do áudio e controles
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    controlIcon.src = "/images/pause.svg";
  }).catch(() => {
    document.body.addEventListener("click", function tryPlayMusic() {
      bgMusic.play().then(() => {
        controlIcon.src = "/images/pause.svg";
        document.body.removeEventListener("click", tryPlayMusic);
      });
    }, { once: true });
  });

  const clickSound = new Audio("./tracks/click.mp3");

  function togglePlay() {
    if (bgMusic.paused) {
      bgMusic.play();
      controlIcon.src = "/images/pause.svg";
    } else {
      bgMusic.pause();
      controlIcon.src = "/images/play.svg";
    }
  }

  controlIcon.addEventListener("click", togglePlay);

  jogarButton && jogarButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });

  regrasButton && regrasButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });
});

// Programação do game

let collors = document.querySelectorAll(".color"); 
let collorsArray = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; 

let collorsArrayRandom = {
  "red": "rgb(255, 0, 0)",
  "yellow": "rgb(255, 255, 0)",
  "orange": "rgb(255, 165, 0)",
  "blue": "rgb(0, 0, 255)",
  "pink": "rgb(255, 192, 203)",
  "purple": "rgb(128, 0, 128)",
  "green": "rgb(0, 128, 0)"
};

let corSelecionada = ""; 
let tentativaAtual = 1; // Tentativa começa na primeira coluna
let botaoConcluir = document.getElementById("botaoConcluir");
let jogadasRestantes = 10;
let h2JogadasRestantes = document.getElementById("jogadasRestantes");

// Função para obter os `holes` da tentativa atual
function getCurrentHoles() {
  return document.querySelectorAll(`.holeT${tentativaAtual}`);
}

// Função para verificar se todos os `holes` da tentativa atual estão preenchidos
function verificarEstadoHoles(holes) {
  const todosPreenchidos = Array.from(holes).every(hole => hole.style.backgroundColor !== "");
  botaoConcluir.style.display = todosPreenchidos ? "block" : "none";
}

// Função para habilitar o preenchimento dos `holes` da tentativa atual
function habilitarPreenchimentoHoles() {
  if (tentativaAtual > 1) {
    const previousHoles = document.querySelectorAll(`.holeT${tentativaAtual - 1}`);
    previousHoles.forEach(hole => {
      hole.style.cursor = "default";
      hole.onclick = null;
    });
}

  const currentHoles = getCurrentHoles();
  currentHoles.forEach(hole => {
    hole.style.cursor = "pointer";
    hole.onclick = function () {
      if (corSelecionada) {
        hole.style.backgroundColor = collorsArrayRandom[corSelecionada];
        verificarEstadoHoles(currentHoles);
        corSelecionada = "";
      }
    };
  });
}

// Embaralha o array e escolhe quatro cores aleatórias
function randomColor(array, numeroDeCores) {
  return array.sort(() => Math.random() - 0.5).slice(0, numeroDeCores);
}

const coresEscolhidas = randomColor(Object.keys(collorsArrayRandom), 4);
console.log("Cores escolhidas:", coresEscolhidas);

// Seleção de cores pelos botões de cor
collors.forEach((element, index) => {
  element.addEventListener("click", function () {
    corSelecionada = collorsArray[index];
  });
});

// Função para validar a tentativa atual
function validarTentativa() {
  const currentHoles = Array.from(getCurrentHoles()).map(hole => window.getComputedStyle(hole).backgroundColor);
  let acertosExatos = 0;
  let acertosCorPosicaoDiferente = 0;

  const fourHoles = document.querySelectorAll(`.four-holeT${tentativaAtual}`);

  for (let i = 0; i < coresEscolhidas.length; i++) {
    const corEscolhida = coresEscolhidas[i];
    const valorRGBEsperado = collorsArrayRandom[corEscolhida];
    const valorRGBHole = currentHoles[i];

    if (valorRGBEsperado === valorRGBHole) {
      acertosExatos++;
      fourHoles[i].style.backgroundColor = "black";
      fourHoles[i].style.outline = "2px solid white";
    } else if (currentHoles.includes(valorRGBEsperado)) {
      acertosCorPosicaoDiferente++;
      fourHoles[i].style.backgroundColor = "white";
      fourHoles[i].style.outline = "2px solid #999999";
    } else {
      fourHoles[i].style.backgroundColor = "#2e2e2e";
      fourHoles[i].style.outline = "none";
    }
  }

  let resultado = document.getElementById("resultadoJogada");
  jogadasRestantes--;
  h2JogadasRestantes.textContent = jogadasRestantes;

  if (acertosExatos === 4) {
    resultado.textContent = "Parabéns! Você acertou a sequência exata!";
    botaoConcluir.style.display = "none";
    document.getElementById("tentarNovamente").style.display = "block";
  } else if (jogadasRestantes <= 0) {
    resultado.textContent = "Suas jogadas acabaram. Você perdeu.";
    botaoConcluir.style.display = "none";
    document.getElementById("tentarNovamente").style.display = "block";
  } else {
    resultado.textContent = `${acertosExatos} cor(es) na posição correta e ${acertosCorPosicaoDiferente} cor(es) na posição diferente.`;
    tentativaAtual++;
    botaoConcluir.style.display = "none"; // Ocultar botão "Concluir" até a próxima tentativa estar preenchida
    habilitarPreenchimentoHoles(); // Habilita a próxima tentativa
  }
}

// Evento de clique no botão "Concluir" para validar a tentativa
botaoConcluir.addEventListener("click", validarTentativa);

// Inicializa o jogo com a primeira tentativa habilitada
habilitarPreenchimentoHoles();
