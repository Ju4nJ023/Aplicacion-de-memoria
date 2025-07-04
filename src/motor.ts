import { Carta, Tablero } from './modelo';

const getRandomNumber = (index: number) => Math.floor(Math.random() * (index + 1));

export const barajarCartas = (cartas: Carta[]): Carta[] => {
  const cartasBarajadas = [...cartas];
  for (let i = cartasBarajadas.length - 1; i > 0; i--) {
    const j = getRandomNumber(i);
    // Intercambio de elementos
    let temp = cartasBarajadas[i];
    cartasBarajadas[i] = cartasBarajadas[j];
    cartasBarajadas[j] = temp;
  }
  return cartasBarajadas;
};

/**
 * Comprueba si una carta en un índice dado puede ser volteada.
 */
export const sePuedeVoltearLaCarta = (tablero: Tablero, indice: number): boolean => {
  const carta = tablero.cartas[indice];

  // Si la carta no existe, ya ha sido encontrada, o ya está volteada, no se puede voltear.
  if (!carta || carta.encontrada || carta.estaVuelta) {
    return false;
  }

  // Si ya hay dos cartas levantadas, no se puede voltear otra.
  if (tablero.estadoPartida === "DosCartasLevantadas") {
    return false;
  }

  // Si no se cumple ninguna de las condiciones anteriores, se puede voltear.
  return true;
};

/**
 * Voltea una carta en el índice especificado y actualiza el estado del tablero.
 */
export const voltearLaCarta = (tablero: Tablero, indice: number): void => {

  tablero.cartas[indice].estaVuelta = true;

  // Simplificamos el manejo de estados con if/else if
  if (tablero.estadoPartida === "CeroCartasLevantadas") {
    tablero.indiceCartaVolteadaA = indice;
    tablero.estadoPartida = "UnaCartaLevantada";
  } else if (tablero.estadoPartida === "UnaCartaLevantada") {
    tablero.indiceCartaVolteadaB = indice;
    tablero.estadoPartida = "DosCartasLevantadas";
  }
};

/**
 * Comprueba si dos cartas, identificadas por sus índices, forman una pareja.
 */
export const sonPareja = (indiceA: number, indiceB: number, tablero: Tablero): boolean => {


  const cartaA = tablero.cartas[indiceA];
  const cartaB = tablero.cartas[indiceB];


  return cartaA.idFoto === cartaB.idFoto
};

/**
 * Marca dos cartas como "encontradas" y actualiza el estado del tablero.
 */
export const parejaEncontrada = (tablero: Tablero, indiceA: number, indiceB: number): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;

  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;

  if (esPartidaCompleta(tablero)) {
    tablero.estadoPartida = "PartidaCompleta";
    console.log("[Motor] ¡Partida completa!");
  } else {
    tablero.estadoPartida = "CeroCartasLevantadas";
  }
};

/**
 * Vuelve a poner boca abajo dos cartas que no formaron pareja.
 */
export const parejaNoEncontrada = (tablero: Tablero, indiceA: number, indiceB: number): void => {
  tablero.cartas[indiceA].estaVuelta = false;
  tablero.cartas[indiceB].estaVuelta = false;

  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;

  tablero.estadoPartida = "CeroCartasLevantadas";
};

/**
 * Comprueba si la partida ha sido completada.
 */
export const esPartidaCompleta = (tablero: Tablero): boolean => {
  return tablero.cartas.every(carta => carta.encontrada && carta.estaVuelta);

};

/**
 * Inicia una nueva partida.
 */
export const iniciaPartida = (tablero: Tablero): void => {
  tablero.cartas = barajarCartas(tablero.cartas); // Baraja las cartas

  // Vuelve todas las cartas a boca abajo y no encontradas usando un bucle.
  for (let i = 0; i < tablero.cartas.length; i++) {
    tablero.cartas[i].estaVuelta = false;
    tablero.cartas[i].encontrada = false;
  }

  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
  tablero.estadoPartida = "CeroCartasLevantadas";
  console.log("[Motor] Partida iniciada y cartas barajadas.");
};