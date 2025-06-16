export interface InfoCarta {
  idFoto: number; // id para identificar parejas (ej: 1 para perro, 2 para gato, etc.)
  imagen: string; // URL de la imagen de la carta boca arriba
}


const infoCartas: InfoCarta[] = [
  { idFoto: 1, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/1.png" },
  { idFoto: 2, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/2.png" },
  { idFoto: 3, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/3.png" },
  { idFoto: 4, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/4.png" },
  { idFoto: 5, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/5.png" },
  { idFoto: 6, imagen: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/memo/6.png" },
];


// Interfaz que define el estado completo de una carta en el tablero
export interface Carta {
  idFoto: number;
  imagen: string;
  estaVuelta: boolean;
  encontrada: boolean;
}

// Función para crear una instancia inicial de Carta
const crearCartaInicial = (idFoto: number, imagen: string): Carta => ({
  idFoto,
  imagen,
  estaVuelta: false, 
  encontrada: false, 
});

// Función para crear la colección completa de cartas para el tablero (duplicadas y sin barajar aún)
const crearColeccionDeCartasInicial = (infoCartas: InfoCarta[]): Carta[] => {
  // Duplicamos las infoCartas
  const infoCartasDuplicadas = [...infoCartas, ...infoCartas];

 
  // Usamos un bucle for en lugar de map para simplificar
  const cartasGeneradas: Carta[] = [];
  for (let i = 0; i < infoCartasDuplicadas.length; i++) {
    const info = infoCartasDuplicadas[i];
    cartasGeneradas.push(crearCartaInicial(info.idFoto, info.imagen));
  }
  return cartasGeneradas;
};


export type EstadoPartida =
  | "PartidaNoIniciada" 
  | "CeroCartasLevantadas" 
  | "UnaCartaLevantada" 
  | "DosCartasLevantadas" 
  | "PartidaCompleta"; 

// Interfaz que define el estado global del tablero de juego
export interface Tablero {
  cartas: Carta[]; 
  estadoPartida: EstadoPartida; 
  indiceCartaVolteadaA?: number; 
  indiceCartaVolteadaB?: number; 
}

export const crearTableroInicial = (): Tablero => ({

  cartas: crearColeccionDeCartasInicial(infoCartas),
  estadoPartida: "PartidaNoIniciada", 
  indiceCartaVolteadaA: undefined, 
  indiceCartaVolteadaB: undefined,
});


export let tablero: Tablero = crearTableroInicial();