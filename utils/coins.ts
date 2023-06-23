import { Dimension, CoinPosition, Coin } from "../types/index.js";

/**
 * Obtiene una coordenada entera entre mínimo y un máximo.
 * @param min - Limite mínimo.
 * @param max - Limite máximo.
 * @returns Un número entero aleatorio entre el mínimo y el máximo.
 */
function getRandomCord(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera el ID de la moneda.
 * @param coinData - Objeto con la posición 3D de la moneda.
 * @returns Un string producto de la posición única de la moneda en la sala.
 */
function getCoinId(coinData: CoinPosition): string {
    return `${coinData.x}-${coinData.y}-${coinData.z}`;
}

/**
 * Genera la información de la moneda.
 * Su posición e ID único.
 * @param roomDimension - Objeto con los límites 3D de la habitación.
 * @returns Un objeto con la información de la moneda generada.
 */
function getCoinData(roomDimension: Dimension): Coin {
    const coinData = {
        x: getRandomCord(...roomDimension.x),
        y: getRandomCord(...roomDimension.y),
        z: getRandomCord(...roomDimension.z),
    };

    return {
        id: getCoinId(coinData),
        ...coinData,
    };
}

/**
 * Genera un Array de monedas.
 * @param maxCoins - Número máximo de monedas.
 * @param roomDimension - Objeto con los límites 3D de la habitación.
 * @returns Un Array con los datos de las monedas generadas.
 */
function generateCoins(
    maxCoins: number,
    roomDimension: Dimension
): Coin[] {
    return Array.from({ length: maxCoins }, (_, i) => getCoinData(roomDimension));
}

export { 
    generateCoins 
}