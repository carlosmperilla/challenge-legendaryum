// Types
import { Rooms, CacheClients } from "../../types/index.js";

import { RedisClientType } from 'redis';
import { Server as SocketIOServer } from 'socket.io';

import { createClient } from 'redis';
import { getCurrentRooms } from "../../utils/index.js";

// const EXPIRATION_TIME = 30; // en segundos. 30 segundos para testing
const EXPIRATION_TIME = 60 * 60 // en segundos. 1 hora

const REDIS_URL:string = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Inicializa el cache.
 * - Crea un cliente Publisher.
 * - Se establece un Hook para informar errores.
 * - Conecta al Publisher.
 * - Se configura el Publisher para notificar la expiración de datos.
 * - Crea un cliente Subscripber duplicando la configuración del Publisher.
 * - Conecta al Subscriber.
 * @returns Promesa con los clientes, el Publisher y el Subscriber.
 */
const initCache = async (): Promise<CacheClients> => {
    // El cliente hay que adaptarlo y verlo en Docker
    // const pub: RedisClientType = createClient({
    //     url: 'redis://default:foobared@localhost:6379'
    // });

    const pub: RedisClientType = createClient({
        url: REDIS_URL
    });

    pub.on('error', (err: Error) => console.log('Redis Client Error', err));

    await pub.connect();
    pub.configSet('notify-keyspace-events', 'Ex');

    const sub: RedisClientType = pub.duplicate();
    await sub.connect();

    return {
        pub,
        sub
    }
};

/**
 * Persiste los datos en cache.
 * - Castea a String el objeto de habitaciones.
 * - Persiste los datos con una expiración constante.
 * - Regresa la información persistida casteada a string.
 * @param pub - Publisher que persistira los datos.
 * @param key - Llave del dato a persistir.
 * @param value - Valor del dato a persistir.
 * @returns Promesa con la información persistida casteada a string.
 */
const persistData = async (pub: RedisClientType, key: string, value: Rooms): Promise<string> => {
    const data: string = JSON.stringify(value);
    await pub.set(key, data, { 'EX': EXPIRATION_TIME });
    return data;
};

/**
 * Obtiene los datos en cache.
 * - Consulta los datos en cache.
 * @param pub - Publisher que consultara los datos.
 * @param key - Llave del dato persistido.
 * @returns Promesa con la información persistida casteada a string. O null si la información no existe.
 */
const getData = async (pub: RedisClientType, key: string): Promise<string | null> => {
    const data: string | null = await pub.get(key);
    return data;
};

/**
 * Actualiza los datos en cache.
 * - Obtiene el TTL del dato a actualizar.
 * - Castea a string el dato actaulizado (newValue)
 * - Actualiza en cache el dato, estableciendo como expiración el TTL obtenido.
 * @param pub - Publisher que consultara los datos.
 * @param key - Llave del dato persistido.
 * @param newValue - Valor que actualiza el dato persistido.
 * @returns Promise<void>
 */
const updateData = async (pub: RedisClientType, key: string, newValue: Rooms): Promise<void> => {
    // Actualiza la información, persistiéndola, y respetando el tiempo de vida (ttl).
    const auxExpirationTime: number = await pub.ttl(key);
    const data: string = JSON.stringify(newValue);
    await pub.set(key, data, { 'EX': auxExpirationTime });
};

/**
 * Actualiza los datos en cache, cuando estos expiran.
 * - El Subscriber se suscribe al evento de expiración.
 * - Consulta y almacena los datos de las habitaciones.
 * - Al consultar se generan nuevos datos.
 * - Informa a cada habitación, emitiendo las nuevas posiciones de monedas.
 * @param sub - Subscriber que capturara el evento de expiración.
 * @param io - Instancia SocketIO para informar a los clientes conectados.
 * @returns Promise<void>
 */
const autoCoinUpdate = async (sub: RedisClientType, io: SocketIOServer): Promise<void> => {
    // Actualiza las monedas cuando expiran
    sub.subscribe('__keyevent@0__:expired', async (key: string) => {
        const currentRooms: Rooms = await getCurrentRooms();
        const roomNames: string[] = Object.keys(currentRooms);
        for (const roomName of roomNames) {
            io.in(roomName).emit('coins', JSON.stringify(currentRooms[roomName].coins));
        }
    });
};

const { pub, sub } = await initCache();

export {
    pub,
    sub,
    persistData,
    getData,
    updateData,
    autoCoinUpdate,
}