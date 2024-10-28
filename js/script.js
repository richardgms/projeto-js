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
let holesT1 = document.querySelectorAll(".holeT1"); 

let estadoHoles = Array(holesT1.length).fill(false); // Array para monitorar o estado de preenchimento de cada hole
let botaoConcluir = document.getElementById("botaoConcluir");

// Embaralha o array e pega quatro cores aleatórias
function randomColor(array, numeroDeCores) {
  return array.sort(() => Math.random() - 0.5).slice(0, numeroDeCores);
}
const coresEscolhidas = randomColor(Object.keys(collorsArrayRandom), 4); // Pegando chaves do objeto como array e embaralhando
console.log("Cores escolhidas:", coresEscolhidas); // Exibe as cores escolhidas

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
    holeT1.style.backgroundColor = collorsArrayRandom[corSelecionada];

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

// Adiciona um listener no botão de conclusão
botaoConcluir.addEventListener("click", function () {
  
  console.log("Cores escolhidas:", coresEscolhidas);

  // Validação da ordem das cores.
  let corHole1 = window.getComputedStyle(holesT1[0]).backgroundColor;
  let corHole2 = window.getComputedStyle(holesT1[1]).backgroundColor;
  let corHole3 = window.getComputedStyle(holesT1[2]).backgroundColor;
  let corHole4 = window.getComputedStyle(holesT1[3]).backgroundColor;
  console.log("Cores nos holes:", corHole1, corHole2, corHole3, corHole4);
  console.log("Cores aleatórias RGB:", 
            collorsArrayRandom[coresEscolhidas[0]], 
            collorsArrayRandom[coresEscolhidas[1]], 
            collorsArrayRandom[coresEscolhidas[2]], 
            collorsArrayRandom[coresEscolhidas[3]]);

  if (corHole1 === collorsArrayRandom[coresEscolhidas[0]] &&
      corHole2 === collorsArrayRandom[coresEscolhidas[1]] &&
      corHole3 === collorsArrayRandom[coresEscolhidas[2]] &&
      corHole4 === collorsArrayRandom[coresEscolhidas[3]]) {
        console.log("Parabéns, você acertou!");
      } else {
        console.log("Você errou, tente novamente.");
      }
});



