import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import roomService from './services/roomService';

const PORT = process.env.PORT || 8080;

const cors = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}
  
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors });

app.get('/', (request: Request, response: Response) => {
    response.send('Hello world!')
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('buzz', () => {
        const time = new Date().toLocaleTimeString();
        console.log(`Buzz at ${time}`);
        io.emit('buzz');
    });

    socket.on('room:create', () => {
        const room = roomService.createRoom();
        room.ownerId = socket.id;
        socket.join(room.id);
        socket.emit('room:created', room);
    });

    socket.on('room:join', (roomId: string, name: string) => {
        try {
            const room = roomService.addPlayerToRoom(roomId, socket.id, name);
            console.log(room);
            socket.join(roomId);
            socket.emit('room:joined', room);
            io.to(room.id).emit('room:updated', room);
        } catch (error) {
            console.log('Error joining room', error)
        }
    });

    socket.on('room:buzz', (roomId: string) => {
        try {
            const room = roomService.buzzPlayer(roomId, socket.id);
            io.to(room.id).emit('room:updated', room);
        } catch (error) {
            console.log('Error buzzing');
        }
    })

    socket.on('room:reset', (roomId: string) => {
        try {
            const room = roomService.resetPlayerBuzzes(roomId);
            io.to(room.id).emit('room:updated', room);
        } catch (error) {
            console.log('Error reseting');
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        try {
            const rooms = roomService.getRoomsByPlayerId(socket.id);
            rooms.forEach(room => {
                const r = roomService.removePlayerFromRoom(room.id, socket.id);
                io.to(room.id).emit('room:updated', r);
            });
        } catch (error) {
            console.log('Error disconnecting player', error);
        }
    });
});

server.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
  

