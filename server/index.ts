// Typing
import { Application } from "express";
import { Server } from 'http';
import { Server as SocketIOServer } from "socket.io";

import express from "express";
import { createServer } from 'http';

import api from "./api/index.js";
import socket from "./socket/index.js";
import { sub, autoCoinUpdate } from "./cache/index.js";

import { fillRooms } from "../utils/index.js";

const PORT: number = 3000;
const app: Application = express();
const httpServer: Server = createServer(app);
const io: SocketIOServer = socket(httpServer);


// inicializar las salas
await fillRooms();

// Iniciar la actualización automática
autoCoinUpdate(sub, io);

// Inicializando el servicio de la API
api(app);

httpServer.listen(PORT);