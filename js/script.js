document.addEventListener("DOMContentLoaded", function () {
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const resultadoJogada = document.getElementById("resultadoJogada");
  const cores = document.getElementById("cores");
  const bgMusic = document.querySelector("#bg-music");
  const controlIcon = document.querySelector("#control-icon");
  const jogarButton = document.querySelector(".jogar");
  const regrasButton = document.querySelector(".regras");
  const voltarButton = document.querySelector("#voltar");

  // Função para ajustar a posição do #cores com base no conteúdo do #resultadoJogada
  function ajustarPosicaoCores() {
    if (mediaQuery.matches && resultadoJogada && cores) {
      if (resultadoJogada.textContent.trim() === "") {
        cores.style.marginTop = "40px";
        cores.style.marginBottom = "40px";
      } else {
        cores.style.marginTop = "20px";
        cores.style.marginBottom = "20px";
      }
    }
  }

  // Verifica inicialmente
  ajustarPosicaoCores();

  // Observa mudanças no conteúdo do #resultadoJogada apenas se ele existir
  if (resultadoJogada) {
    const observer = new MutationObserver(ajustarPosicaoCores);
    observer.observe(resultadoJogada, { childList: true });
  }

  // Reaplica as mudanças ao redimensionar a tela
  mediaQuery.addListener(ajustarPosicaoCores);

  // Controle de música de fundo
  bgMusic.volume = 0.3;
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

  // Som de clique para os botões
  const clickSound = new Audio("../tracks/click.mp3");
  clickSound.load();
  clickSound.volume = 0.5;

  controlIcon.addEventListener("click", () => {
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.log("Erro ao reproduzir som:", error));
  });

  // Evento para o botão de voltar
  voltarButton && voltarButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Clicou em Voltar");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 300);
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.log("Erro ao reproduzir som:", error));
  });

  // Evento para o botão Jogar
  jogarButton && jogarButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Clicou em Jogar");
    setTimeout(() => {
      window.location.href = "../pages/play.html";
    }, 300);
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.log("Erro ao reproduzir som:", error));
  });

  // Evento para o botão Regras
  regrasButton && regrasButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Clicou em Regras");
    setTimeout(() => {
      window.location.href = "../pages/regras.html";
    }, 300);
    clickSound.pause();
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.log("Erro ao reproduzir som:", error));
  });

  // Configuração inicial das variáveis de cor e tentativas
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
  let tentativaAtual = 1;
  let botaoConcluir = document.getElementById("botaoConcluir");
  let jogadasRestantes = 10;
  let h2JogadasRestantes = document.getElementById("jogadasRestantes");

  function randomColor(array, numeroDeCores) {
    return array.sort(() => Math.random() - 0.5).slice(0, numeroDeCores);
  }

  const coresEscolhidas = randomColor(Object.keys(collorsArrayRandom), 4);
  console.log("Cores escolhidas:", coresEscolhidas);

  collors.forEach((element, index) => {
    element.addEventListener("click", function () {
      corSelecionada = collorsArray[index];
    });
  });

  habilitarPreenchimentoHoles();

  function getCurrentHoles() {
    return document.querySelectorAll(`.holeT${tentativaAtual}`);
  }

  function verificarEstadoHoles(holes) {
    const todosPreenchidos = Array.from(holes).every(hole => hole.classList.contains("preenchido"));
    botaoConcluir.style.display = todosPreenchidos ? "block" : "none";
  }

  function habilitarPreenchimentoHoles() {
    if (tentativaAtual > 1) {
      const previousHoles = document.querySelectorAll(`.holeT${tentativaAtual - 1}`);
      previousHoles.forEach(hole => {
        hole.style.cursor = "default";
        hole.removeEventListener("click", preencherCor);
      });
    }

    const currentHoles = getCurrentHoles();
    currentHoles.forEach(hole => {
      hole.style.cursor = "pointer";
      hole.addEventListener("click", preencherCor);
    });
  }

  function preencherCor(event) {
    const hole = event.target;
    if (corSelecionada) {
      hole.style.backgroundColor = collorsArrayRandom[corSelecionada];
      hole.classList.add("preenchido");
      corSelecionada = "";
      verificarEstadoHoles(getCurrentHoles());
    }
  }

  function validarTentativa() {
    const currentHoles = Array.from(getCurrentHoles()).map(hole => window.getComputedStyle(hole).backgroundColor);
    let acertosExatos = 0;
    let acertosCorPosicaoDiferente = 0;
    const fourHoles = document.querySelectorAll(`.four-holeT${tentativaAtual}`);

    const coresEscolhidasChecadas = Array(coresEscolhidas.length).fill(false);
    const currentHolesChecados = Array(currentHoles.length).fill(false);

    for (let i = 0; i < coresEscolhidas.length; i++) {
      const valorRGBEsperado = collorsArrayRandom[coresEscolhidas[i]];
      if (currentHoles[i] === valorRGBEsperado) {
        acertosExatos++;
        coresEscolhidasChecadas[i] = true;
        currentHolesChecados[i] = true;
        fourHoles[i].style.backgroundColor = "black";
        fourHoles[i].style.outline = "2px solid white";
      }
    }

    for (let i = 0; i < coresEscolhidas.length; i++) {
      const valorRGBEsperado = collorsArrayRandom[coresEscolhidas[i]];
      if (!coresEscolhidasChecadas[i]) {
        for (let j = 0; j < currentHoles.length; j++) {
          if (!currentHolesChecados[j] && currentHoles[j] === valorRGBEsperado) {
            acertosCorPosicaoDiferente++;
            currentHolesChecados[j] = true;
            fourHoles[j].style.backgroundColor = "white";
            fourHoles[j].style.outline = "2px solid #999999";
            break;
          }
        }
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
      botaoConcluir.style.display = "none";
      habilitarPreenchimentoHoles();
    }
  }

  // Verifica se o botaoConcluir existe antes de adicionar o evento
if (botaoConcluir) {
  botaoConcluir.addEventListener("click", validarTentativa);
}

// Certifique-se de chamar a função para habilitar o preenchimento das "holes"
if (botaoConcluir) {
  habilitarPreenchimentoHoles();
}
});
