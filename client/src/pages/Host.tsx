import { useEffect, useState } from "react";
import { useSocketContext } from "../hooks/useSocketContext";
import { useNavigate } from "react-router-dom";

const Host: React.FC = () => {
    const { socket } = useSocketContext();
    const [room, setRoom] = useState<any>();
    const navigate = useNavigate();

    useEffect(() => {
        // navigate back to home if user loses connection
        if (!socket) {
            navigate('/');
            return;
        }

        socket?.emit('room:create');

        socket?.on('room:created', (newRoom: any) => {
            setRoom(newRoom);
        });

        return () => {
            socket?.off('room:created');
        }
    }, [socket]);

    return (
        <div className='host-container'>
            <h1>Hello from host!</h1>
            {room ? (
                <p>Room ID: {room.id}</p>
            ) : (
                <p>Creating room..</p>
            )}
        </div>
    )
};

export default Host;