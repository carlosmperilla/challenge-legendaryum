import { Rooms } from "../../types/index.js";

import { Server } from 'http';
import { Server as SocketIOServer, Socket } from "socket.io";
import { getCurrentRooms, updateCurrentRooms } from "../../utils/index.js";

export default function socket(httpServer: Server): SocketIOServer {
    const io: SocketIOServer = new SocketIOServer(httpServer);
    io.on('connection', (socket: Socket) => {

        socket.on('joinRoom', async (roomName: string) => {
            const currentRooms: Rooms = await getCurrentRooms();
            const roomNames: string[] = Object.keys(currentRooms);
            if (roomNames.includes(roomName)) {
                
                // salir de las otras salas anteriores.
                socket.rooms.forEach((room: string) => {
                    if (room !== socket.id) socket.leave(room);
                });
                
                // unirse a la nueva sala.
                socket.join(roomName);
                socket.emit("coins", JSON.stringify(currentRooms[roomName].coins));
            } else {
                console.error("no es una room valida");
            }
        });
        
        socket.on("coinPicked", async (idCoin: string) => {
            const roomName: string | undefined = [...socket.rooms][1];
            
            // si tiene una sala asignada
            if (roomName !== undefined) {
                await updateCurrentRooms(roomName, idCoin);
                
                // Enviando el id a todos los de la sala, menos el sender.
                socket.to(roomName).emit("unAvailableCoin", idCoin);
            }
        });
    
    });
    return io;
}