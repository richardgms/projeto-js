document.addEventListener("DOMContentLoaded", function () {
  const bgMusic = document.querySelector("#bg-music");
  const controlIcon = document.querySelector("#control-icon");
  const jogarButton = document.getElementById("jogar");
  const regrasButton = document.getElementById("regras");
  const botaoConcluir = document.getElementById("botaoConcluir");
  const clickSound = new Audio("./tracks/click.mp3");

  bgMusic.volume = 0;
  bgMusic.play().then(() => {
      controlIcon.src = "/images/pause.svg";
  }).catch(() => {
      // Se falhar, adiciona um listener para tentar novamente na primeira interação.
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

  jogarButton.addEventListener("click", () => {
      clickSound.play();
      clickSound.currentTime = 0;
  });

  regrasButton.addEventListener("click", () => {
      clickSound.play();
      clickSound.currentTime = 0;
  });

  // Programação do game.
  let collors = document.querySelectorAll(".color"); // Pega todas as cores.
  let collorsArray = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; // Array de cores.
  let collorsArrayRandom = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; // Array de cores para a seleção aleatória.
  let corSelecionada = ""; // Variável que recebe a cor selecionada.
  let holes = document.querySelectorAll(".hole"); // Pega todos os "holes".
  let holesT1 = document.querySelectorAll(".holeT1"); // Pega todos os "holes T1".

  // Pega as cores por ID e coloca no array.
  collorsArray.red = document.querySelector("#vermelho");
  collorsArray.yellow = document.querySelector("#amarelo");
  collorsArray.orange = document.querySelector("#laranja");
  collorsArray.blue = document.querySelector("#azul");
  collorsArray.pink = document.querySelector("#rosa");
  collorsArray.purple = document.querySelector("#roxo");
  collorsArray.green = document.querySelector("#verde");

  // Embaralha o array e pega quatro cores aleatórias.
  function randomColor(array, numeroDeCores) {
      let arrayEmbaralhado = array.sort(() => Math.random() - 0.5);
      return arrayEmbaralhado.slice(0, numeroDeCores);
  };

  let coresEscolhidas = randomColor(collorsArrayRandom, 4);
  console.log("Cores escolhidas:", coresEscolhidas);

  // Adiciona um listener em cada cor, que ao receber um click, envia para a variável "corSelecionada" e muda o cursor dos holes para "pointer".
  collors.forEach((element, index) => {
      element.addEventListener("click", function () {
          holesT1.forEach(hole => {
              hole.style.cursor = "pointer";
              const currentColor = getComputedStyle(hole).getPropertyValue("background-color");
              console.log(currentColor);
              if (currentColor === "rgb(46, 46, 46)" || currentColor === "#2e2e2e") {
                  hole.style.backgroundColor = "#444444";
              }
          });
          corSelecionada = collorsArray[index];
      });
  });

  // Adiciona um listener em cada hole, que ao ser clicado, muda o cursor para default novamente.
  holesT1.forEach(hole => {
      hole.addEventListener("click", function () {
          holesT1.forEach(hole => {
              hole.style.cursor = "default";
          });
      });
  });

  // Adiciona um listener em cada hole, mudando a cor do hole para a cor selecionada.
  holesT1.forEach(holeT1 => {
      holeT1.addEventListener("click", function () {
          if (corSelecionada) {
              holeT1.style.backgroundColor = corSelecionada;
              corSelecionada = "";
              verificarHoles();
          }
      });
  });

  // Botão concluir aparece depois que todas as cores foram selecionadas.
  function verificarHoles() {
      const todosAlterados = Array.from(holesT1).every(hole => {
          const backgroundColor = getComputedStyle(hole).backgroundColor;
          // Verifica se a cor de fundo não é uma das indesejadas
          return (
              backgroundColor !== "rgb(68, 68, 68)" && // #444444 em RGB
              backgroundColor !== "rgb(46, 46, 46)" && // #2e2e2e em RGB
              backgroundColor !== "#444444" &&
              backgroundColor !== "#2e2e2e"
          );
      });

      // Exibe o botão apenas se todos os buracos tiverem a cor alterada
      if (todosAlterados) {
          botaoConcluir.style.display = "block";
      } else {
          botaoConcluir.style.display = "none"; // Oculta o botão se não estiver pronto
      }
  }
});
