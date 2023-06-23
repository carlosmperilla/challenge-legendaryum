import { Rooms, Room, RoomData } from "../../types/index.js";

import { getCurrentRooms } from "../../utils/index.js";
import { Application, Request, Response } from 'express';

export default function api(app: Application): void {
    app.get('/', (req: Request, res: Response) => {
        res.json({"message": "Bienvenidos personas!"})
    });
    
    app.get('/rooms', async (req: Request, res: Response) => {
        const currentRooms: Rooms = await getCurrentRooms();
        const roomNames: string[] = Object.keys(currentRooms);
        const roomsData: RoomData = {};
        for (const roomName of roomNames) {
            const totalCoin: number = currentRooms[roomName].coins.length;
            roomsData[roomName] = {
                totalCoin,
                ...currentRooms[roomName]
            };
        }
        res.json(roomsData);
    });
    
    app.get('/rooms/:name', async (req: Request, res: Response) => {
        const currentRooms: Rooms = await getCurrentRooms();
        const roomNames: string[] = Object.keys(currentRooms);
        const roomName: string = req.params.name;
        if (roomNames.includes(roomName)) {
            const currentRoom: Room = currentRooms[roomName];
            res.json({
                totalCoin: currentRoom.coins.length,
                ...currentRooms[roomName]
            });
        } else {
            res.status(404).json({ error: 'Room not found' });
        }
    });
}
