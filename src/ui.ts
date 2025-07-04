import { tablero, crearTableroInicial, Carta, EstadoPartida, Tablero } from './modelo';
import {
  iniciaPartida,
  sePuedeVoltearLaCarta,
  voltearLaCarta,
  sonPareja,
  parejaEncontrada,
  parejaNoEncontrada,
  esPartidaCompleta,
} from './motor';



const gameGrid = document.getElementById('game-grid') as HTMLDivElement | null;
const startButton = document.getElementById('start-button') as HTMLButtonElement | null;
const messageDiv = document.getElementById('message') as HTMLDivElement | null;

let cardElements: HTMLDivElement[] = [];

const initializeUI = (): void => {
  if (gameGrid) {
    cardElements = Array.from(gameGrid.getElementsByClassName('card')) as HTMLDivElement[];

    cardElements.forEach(cardDiv => {
      const index = parseInt(cardDiv.dataset.cardIndex || '-1');
      if (index !== -1) {
        cardDiv.removeEventListener('click', () => handleCardClick(index));
        cardDiv.addEventListener('click', () => handleCardClick(index));
      }
    });
  }
  dibujarTablero();
};

const dibujarTablero = (): void => {
  if (!gameGrid || cardElements.length === 0) {
    return;
  }

  if (cardElements.length !== tablero.cartas.length) {
    return;
  }

  for (let i = 0; i < tablero.cartas.length; i++) {
    const cartaDelModelo = tablero.cartas[i];
    const cardDivElement = cardElements[i];

    const imgElement = cardDivElement.querySelector('img');
    if (imgElement) {
      if (cartaDelModelo.estaVuelta || cartaDelModelo.encontrada) {
        imgElement.src = cartaDelModelo.imagen;
        imgElement.style.display = 'block'; // Asegúrate de que la imagen sea visible
        cardDivElement.style.backgroundColor = 'transparent'; // Quita el fondo blanco si la carta está volteada
      } else {
        // Si la carta NO está volteada ni encontrada, ocultamos la imagen
        imgElement.style.display = 'none';
        // Y le damos el color de fondo blanco al div de la carta
        cardDivElement.style.backgroundColor = 'white';
      }
      imgElement.alt = `Carta ${i + 1}`;
    }

    cardDivElement.classList.toggle('matched', cartaDelModelo.encontrada);
    cardDivElement.classList.toggle('flipped', cartaDelModelo.estaVuelta && !cartaDelModelo.encontrada);

    if (cartaDelModelo.encontrada) {
      cardDivElement.style.pointerEvents = 'none';
    } else {
      cardDivElement.style.pointerEvents = 'auto';
    }
  }

  actualizarMensajeEstado();
};

const getMessage = () => {
  if (tablero.estadoPartida === "PartidaNoIniciada") {
    return "¡Bienvenido al Juego de Parejas! Haz clic en 'Iniciar Partida' para empezar.";
  } else if (tablero.estadoPartida === "CeroCartasLevantadas") {
    return "Turno nuevo. ¡Selecciona la primera carta!";
  } else if (tablero.estadoPartida === "UnaCartaLevantada") {
    return "Has levantado una carta. Ahora, busca su pareja.";
  } else if (tablero.estadoPartida === "DosCartasLevantadas") {
    return "Dos cartas levantadas. Comprobando si son pareja...";
  } else if (tablero.estadoPartida === "PartidaCompleta") {
    return "¡Felicidades! ¡Has encontrado todas las parejas!";
  }
  return "Estado desconocido.";
}

const actualizarMensajeEstado = (): void => {
  if (!messageDiv) {
    console.warn("El elemento 'message' no se encontró en el DOM.");
    return;
  }

  messageDiv.textContent = getMessage();


};

const handleCardClick = (index: number): void => {
  if (sePuedeVoltearLaCarta(tablero, index)) {
    voltearLaCarta(tablero, index);
    dibujarTablero();
    esLaSegundaCarta(tablero)

  }
 
};

const esLaSegundaCarta = (tablero: Tablero) => {
  console.log("Dos cartas levantadas. Comprobando...");
  const indiceA = tablero.indiceCartaVolteadaA;
  const indiceB = tablero.indiceCartaVolteadaB;

  if (indiceA !== undefined && indiceB !== undefined) {
    if (sonPareja(indiceA, indiceB, tablero)) {
      console.log("¡Par de cartas encontradas!");
      parejaEncontrada(tablero, indiceA, indiceB);
      dibujarTablero();
    } else {

      setTimeout(() => {
        parejaNoEncontrada(tablero, indiceA, indiceB);
        dibujarTablero();
      }, 1000);
    }
  }
}

const handleStartGameClick = (): void => {
  const nuevoEstadoInicial = crearTableroInicial();

  tablero.cartas = nuevoEstadoInicial.cartas;
  tablero.estadoPartida = nuevoEstadoInicial.estadoPartida;
  tablero.indiceCartaVolteadaA = nuevoEstadoInicial.indiceCartaVolteadaA;
  tablero.indiceCartaVolteadaB = nuevoEstadoInicial.indiceCartaVolteadaB;

  iniciaPartida(tablero);
  dibujarTablero();
  console.log("Partida reiniciada y lista para jugar.");
};

document.addEventListener('DOMContentLoaded', () => {
  if (startButton) {
    startButton.addEventListener('click', handleStartGameClick);
  } else {
    console.error("El botón 'start-button' no se encontró en el DOM.");
  }
  initializeUI();
});