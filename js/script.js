document.addEventListener("DOMContentLoaded", function () {
  const bgMusic = document.querySelector("#bg-music");
  const controlIcon = document.querySelector("#control-icon");
  const jogarButton = document.getElementById("jogar");
  const regrasButton = document.getElementById("regras");

  bgMusic.volume = 0;
  bgMusic
    .play()
    .then(() => {
      controlIcon.src = "/images/pause.svg";
    })
    .catch(() => {
      document.body.addEventListener(
        "click",
        function tryPlayMusic() {
          bgMusic
            .play()
            .then(() => {
              controlIcon.src = "/images/pause.svg";
              document.body.removeEventListener("click", tryPlayMusic);
            });
        },
        { once: true }
      );
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

  jogarButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });

  regrasButton.addEventListener("click", () => {
    clickSound.play();
    clickSound.currentTime = 0;
  });
});

// Programação do game.

let collors = document.querySelectorAll(".color"); 
let collorsArray = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; 

let collorsArrayRandom = ["red", "yellow", "orange", "blue", "pink", "purple", "green"]; 
let corSelecionada = ""; 
let holesT1 = document.querySelectorAll(".holeT1"); 

let estadoHoles = Array(holesT1.length).fill(false); // Array para monitorar o estado de preenchimento de cada hole
let botaoConcluir = document.getElementById("botaoConcluir");

// Embaralha o array e pega quatro cores aleatórias
function randomColor(array, numeroDeCores) {
return array.sort(() => Math.random() - 0.5).slice(0, numeroDeCores);
}

let coresEscolhidas = randomColor(collorsArrayRandom, 4);
console.log("Cores escolhidas:", coresEscolhidas);

// Seleção de cores
collors.forEach((element, index) => {
element.addEventListener("click", function () {
  holesT1.forEach(hole => {
    hole.style.cursor = "pointer";
  });
  corSelecionada = collorsArray[index];
});
});

// Evento único para preencher e validar os holesT1
holesT1.forEach((holeT1, index) => {
holeT1.addEventListener("click", function () {
  if (corSelecionada) {
    holeT1.style.backgroundColor = corSelecionada;

    // Atualiza o estado do hole se a cor é válida
    if (corSelecionada !== "#444444" && corSelecionada !== "#2e2e2e") {
      estadoHoles[index] = true;
    }

    corSelecionada = "";
    holesT1.forEach(hole => hole.style.cursor = "default");

    // Verifica se todos os holes estão preenchidos
    verificarEstadoHoles();
  }
});
});

// Verifica o estado dos holes e exibe o botão de conclusão
function verificarEstadoHoles() {
const todosPreenchidos = estadoHoles.every(estado => estado === true);
botaoConcluir.style.display = todosPreenchidos ? "block" : "none";
}
