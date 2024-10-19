import { useAppContext } from "../hooks/useAppContext";
import { Socket } from 'socket.io-client';
import { Room } from '../types';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const BuzzerButton: React.FC<{ socket: Socket | undefined, room: Room | undefined }> = ({ socket, room }) => {
    const handleBuzzButtonClick = () => {
        socket?.emit('room:buzz', room?.id);
    };

    return (
        <button 
            className='buzz-button'
            onClick={handleBuzzButtonClick}
        >
            🔴
        </button>
    )
};

const Play = () => {
    const { socket, room } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket || !room) {
            navigate('/');
        }
    }, [socket, room, navigate]);

    return (
        <div>
            <BuzzerButton socket={socket} room={room} />
        </div>
    )
};

export default Play;