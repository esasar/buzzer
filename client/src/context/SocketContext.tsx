import { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | undefined;
};

const URL = 'http://localhost:8080';

interface SocketProviderProps {
    children: React.ReactNode;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io(URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
        });

        newSocket.on('disconnect', () => {
            navigate('/');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value = {{
            socket
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };