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

botaoConcluir.addEventListener("click", function () {
  console.log("Cores escolhidas:", coresEscolhidas);

  // Converte holesT1 para um array para usar o método map
  let coresHoles = Array.from(holesT1).map(hole => window.getComputedStyle(hole).backgroundColor);
  
  let acertosExatos = 0;
  let acertosCorPosicaoDiferente = 0;
  let posicoesCorretas = [];
  let posicoesIncorretas = [];

  let fourHolesT1 = document.querySelectorAll(".four-holeT1");

  // Verificar se cada cor no hole corresponde exatamente à posição esperada
  for (let i = 0; i < coresEscolhidas.length; i++) {
    const corEscolhida = coresEscolhidas[i];
    const valorRGBEsperado = collorsArrayRandom[corEscolhida];
    const valorRGBHole = coresHoles[i];

    if (valorRGBEsperado === valorRGBHole) {
      acertosExatos++;
      posicoesCorretas.push(i);
      fourHolesT1[i].style.backgroundColor = "black";
      fourHolesT1[i].style.outline = "2px solid white";
      console.log(`Correspondência exata na posição ${i}`);
    } else if (coresHoles.includes(valorRGBEsperado)) {
      acertosCorPosicaoDiferente++;
      const posicaoDiferente = coresHoles.indexOf(valorRGBEsperado);
      posicoesIncorretas.push(posicaoDiferente);
      fourHolesT1[i].style.backgroundColor = "white";
      fourHolesT1[i].style.outline = "2px solid #999999";
      console.log(`A cor ${corEscolhida} foi encontrada, mas em posição diferente: ${posicaoDiferente}`);
    } else {
      fourHolesT1[i].style.backgroundColor = "#2e2e2e";
      fourHolesT1[i].style.outline = "none";
      console.log(`Não foi encontrada a cor ${corEscolhida} em nenhum holeT1`);
    }
  }

  // Retorno do resultado para o console.
  if (acertosExatos === 4) {
    console.log("Parabéns, você acertou a sequência exata!");
  } else {
    console.log(`${acertosExatos} cor(es) na posição correta (Índices: ${posicoesCorretas.join(", ")}), ${acertosCorPosicaoDiferente} cor(es) na posição diferente (Índices: ${posicoesIncorretas.join(", ")}).`);
  }

  // Pega o H2 do HTML e retorna o resultado para o usuário
  let resultado = document.getElementById("resultadoJogada");

  if (acertosExatos > 0 && acertosCorPosicaoDiferente === 0) {
    resultado.textContent = `Você acertou ${acertosExatos} cor(es) na posição correta.`
  } else if (acertosExatos === 0 && acertosCorPosicaoDiferente > 0) {
    resultado.textContent = `Você acertou ${acertosCorPosicaoDiferente} cor(es) na posição diferente.`
  } else if (acertosExatos > 0 && acertosCorPosicaoDiferente > 0) {
    resultado.textContent = `Você acertou ${acertosExatos} cor(es) na posição correta e ${acertosCorPosicaoDiferente} cor(es) na posição diferente.`
  } else if (acertosExatos === 0 && acertosCorPosicaoDiferente === 0) {
    resultado.textContent = `Você não acertou nenhuma cor.`
  } else if (acertosExatos === 4) {
    resultado.textContent = `Parabéns! Você acertou a sequência exata!`
  };
});




