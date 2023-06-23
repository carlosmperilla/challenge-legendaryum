import { Dimension, Coin, ConfigData, Room, Rooms } from "../types/index.js";

import { readFileSync } from "fs";
import { pub, persistData, getData, updateData } from "../server/cache/index.js";
import { generateCoins } from "./coins.js";

const CONFIG_FIlE: string = "config/basic.json";
const ROOMS_KEY: string = "currentRooms";

/**
 * Obtiene la información de Configuración Básica.
 * @returns Un objeto con la configuración del archivo de configuración.
 */
function getConfigData(): ConfigData {
    const data: string = readFileSync(CONFIG_FIlE, 'utf8');
    return JSON.parse(data)
}

/**
 * Llena las habitaciones.
 * - Lee la configuración.
 * - Genera las monedas por habitación.
 * - Persiste los datos en cache.
 * @returns Promise<void>
 */
async function fillRooms(): Promise<void> {
    const configData: ConfigData = getConfigData();
    const roomNames: string[] = Object.keys(configData);
    const currentRooms: Rooms = {};
    for (const room of roomNames){
        const maxCoins: number = configData[room].maxCoins;
        const roomDimension: Dimension = configData[room].dimension;
        currentRooms[room] = {
            coins: generateCoins(maxCoins, roomDimension)
        };
    }
    await persistData(pub, ROOMS_KEY, currentRooms);
}

/**
 * Obtiene la información de las habitaciones o la genera.
 * - Obtiene los datos de cache.
 * - Si no existen los datos, los crea y los vuelve a leer.
 * @returns Habitaciones con sus monedas.
 */
async function getCurrentRooms(): Promise<Rooms> {
    let data: string | null = await getData(pub, ROOMS_KEY);
    if (data === null) {
        await fillRooms();
        data = await getData(pub, ROOMS_KEY);
    }
    const currentRooms: Rooms = JSON.parse(data || "{}");
    return currentRooms;
}

/**
 * Actualiza la información de una habitación, borrando la moneda no disponible.
 * - Consulta la información de las habitaciones.
 * - Obtiene la información de la habitación.
 * - Filtra las monedas, para eliminar la moneda no disponible.
 * - Persiste la información en cache.
 * @param roomName - Nombre de la habitación.
 * @param idCoin - ID de la moneda.
 * @returns Promise<void>
 */
async function updateCurrentRooms(roomName: string, idCoin: string): Promise<void> {
    const currentRooms: Rooms = await getCurrentRooms();
    const currentRoom: Room = currentRooms[roomName];
    currentRoom.coins = currentRoom.coins.filter( (coin: Coin) => coin.id !== idCoin);

    await updateData(pub, ROOMS_KEY, currentRooms);
}

export {
    getCurrentRooms,
    updateCurrentRooms,
    fillRooms
}