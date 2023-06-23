import { RedisClientType } from 'redis';

interface Dimension {
    x: [number, number];
    y: [number, number];
    z: [number, number];
}

interface CoinPosition {
    x: number;
    y: number;
    z: number;
}

interface Coin extends CoinPosition {
    id: string;
}

interface ConfigData {
    [key: string]: {
        maxCoins: number;
        dimension: Dimension;
    }
}

interface Room {
    coins: Coin[];
}

interface Rooms {
    [key: string]: Room;
}

interface RoomInfo extends Room {
    totalCoin: number;
}

interface RoomData {
    [key: string]: RoomInfo;
}

interface CacheClients {
    pub: RedisClientType;
    sub: RedisClientType;
}

export {
    Dimension,
    CoinPosition,
    Coin,
    ConfigData,
    Room,
    Rooms,
    RoomData,
    CacheClients
}