import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { Room } from '../types';

interface AppContextType {
    socket: Socket | undefined;
    room: Room | undefined; 
    setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
};

const isNodeEnv = typeof process !== 'undefined' && process.env;

const URL = isNodeEnv ? process.env.VITE_API_URL : 'http://localhost';
const PORT = isNodeEnv ? process.env.VITE_API_PORT : 8080;

interface AppProviderProps {
    children: React.ReactNode;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [room, setRoom] = useState<Room | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io(`${URL}:${PORT}`);
        setSocket(newSocket);

        newSocket.on('connect', () => {
        });

        newSocket.on('disconnect', () => {
            navigate('/');
        });

        newSocket?.on('room:updated', (room: Room) => {
            setRoom(room);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <AppContext.Provider value = {{
            socket,
            room,
            setRoom
        }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppProvider, AppContext };