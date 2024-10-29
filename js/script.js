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
    // Caso o navegador bloqueie a reprodução automática, inicia ao clicar
    document.body.addEventListener("click", function tryPlayMusic() {
      bgMusic.play().then(() => {
        controlIcon.src = "/images/pause.svg";
        document.body.removeEventListener("click", tryPlayMusic);
      });
    }, { once: true });
  });

  const clickSound = new Audio("./tracks/click.mp3");

  // Função de alternância entre play/pause para a música de fundo
  function togglePlay() {
    if (bgMusic.paused) {
      bgMusic.play();
      controlIcon.src = "/images/pause.svg";
    } else {
      bgMusic.pause();
      controlIcon.src = "/images/play.svg";
    }
  }

  // Controla a música quando o ícone é clicado
  controlIcon.addEventListener("click", togglePlay);

  // Sons para os botões "Jogar" e "Regras"
  jogarButton && jogarButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });

  regrasButton && regrasButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });
});

// Configuração inicial das variáveis de cor e tentativas
let collors = document.querySelectorAll(".color"); 
let collorsArray = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; 

// Valores RGB associados a cada cor
let collorsArrayRandom = {
  "red": "rgb(255, 0, 0)",
  "yellow": "rgb(255, 255, 0)",
  "orange": "rgb(255, 165, 0)",
  "blue": "rgb(0, 0, 255)",
  "pink": "rgb(255, 192, 203)",
  "purple": "rgb(128, 0, 128)",
  "green": "rgb(0, 128, 0)"
};

let corSelecionada = ""; // Cor escolhida pelo jogador
let tentativaAtual = 1; // Inicia com a primeira tentativa
let botaoConcluir = document.getElementById("botaoConcluir");
let jogadasRestantes = 10;
let h2JogadasRestantes = document.getElementById("jogadasRestantes");

// Função para embaralhar as cores e escolher 4 aleatórias
function randomColor(array, numeroDeCores) {
  return array.sort(() => Math.random() - 0.5).slice(0, numeroDeCores);
}

// Seleciona quatro cores aleatórias como alvo para o jogador
const coresEscolhidas = randomColor(Object.keys(collorsArrayRandom), 4);
console.log("Cores escolhidas:", coresEscolhidas);

// Configuração de evento para cada botão de cor; define a cor selecionada
collors.forEach((element, index) => {
  element.addEventListener("click", function () {
    corSelecionada = collorsArray[index];
  });
});
      
// Inicializa a primeira tentativa ao carregar
habilitarPreenchimentoHoles();

// Função para obter os `holes` da tentativa atual
function getCurrentHoles() {
  return document.querySelectorAll(`.holeT${tentativaAtual}`);
}

// Função para verificar se todos os buracos (`holes`) da tentativa atual estão preenchidos
function verificarEstadoHoles(holes) {
  const todosPreenchidos = Array.from(holes).every(hole => hole.classList.contains("preenchido"));
  console.log("Todos os holes preenchidos:", todosPreenchidos);
  botaoConcluir.style.display = todosPreenchidos ? "block" : "none"; // Mostra o botão "Concluir" se todos estiverem preenchidos
}

// Habilita o preenchimento dos `holes` da tentativa atual e desativa os anteriores
function habilitarPreenchimentoHoles() {
  if (tentativaAtual > 1) {
    const previousHoles = document.querySelectorAll(`.holeT${tentativaAtual - 1}`);
    previousHoles.forEach(hole => {
      hole.style.cursor = "default";
      hole.removeEventListener("click", preencherCor); // Remove o evento de clique nos `holes` anteriores
    });
  }

  const currentHoles = getCurrentHoles();
  currentHoles.forEach(hole => {
    hole.style.cursor = "pointer";
    hole.addEventListener("click", preencherCor); // Adiciona o evento de clique para preencher os `holes`
  });
}

// Função que preenche o `hole` clicado com a cor selecionada e verifica o estado
function preencherCor(event) {
  const hole = event.target;
  if (corSelecionada) {
    hole.style.backgroundColor = collorsArrayRandom[corSelecionada];
    hole.classList.add("preenchido"); // Marca o `hole` como preenchido
    corSelecionada = ""; // Limpa a seleção de cor para a próxima escolha
    verificarEstadoHoles(getCurrentHoles()); // Verifica se todos os `holes` estão preenchidos
  }
}

// Função que valida a tentativa do jogador e compara com as cores-alvo
function validarTentativa() {
  const currentHoles = Array.from(getCurrentHoles()).map(hole => window.getComputedStyle(hole).backgroundColor);
  let acertosExatos = 0;
  let acertosCorPosicaoDiferente = 0;

  const fourHoles = document.querySelectorAll(`.four-holeT${tentativaAtual}`);

  for (let i = 0; i < coresEscolhidas.length; i++) {
    const corEscolhida = coresEscolhidas[i];
    const valorRGBEsperado = collorsArrayRandom[corEscolhida];
    const valorRGBHole = currentHoles[i];

    // Verifica se a cor e posição estão corretas
    if (valorRGBEsperado === valorRGBHole) {
      acertosExatos++;
      fourHoles[i].style.backgroundColor = "black";
      fourHoles[i].style.outline = "2px solid white";
    } else if (currentHoles.includes(valorRGBEsperado)) {
      // Verifica se a cor está correta mas na posição errada
      acertosCorPosicaoDiferente++;
      fourHoles[i].style.backgroundColor = "white";
      fourHoles[i].style.outline = "2px solid #999999";
    } else {
      // Não encontrou a cor, mantém o estilo padrão
      fourHoles[i].style.backgroundColor = "#2e2e2e";
      fourHoles[i].style.outline = "none";
    }
  }

  let resultado = document.getElementById("resultadoJogada");
  jogadasRestantes--;
  h2JogadasRestantes.textContent = jogadasRestantes;

  // Verifica as condições de vitória, derrota ou próxima tentativa
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
    botaoConcluir.style.display = "none"; // Oculta o botão até preencher os `holes` da próxima tentativa
    habilitarPreenchimentoHoles();
  }
}

// Evento de clique no botão "Concluir" que valida a tentativa
botaoConcluir.addEventListener("click", validarTentativa);

// Inicializa o jogo, habilitando a primeira tentativa
habilitarPreenchimentoHoles();
