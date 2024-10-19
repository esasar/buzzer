import { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";

const Join: React.FC = () => {
    const { socket, setRoom } = useAppContext();
    const [roomId, setRoomId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const navigate = useNavigate();

    const handleJoinRoomButtonClick = () => {
        if (socket && roomId && name) {
            socket.emit('room:join', roomId, name);
            socket.on('room:joined', (room: any) => {
                setRoom(room);
                navigate('/play');
            });
        }
    };

    return (
        <div>
            <a>Room Id</a>
            <input 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <a>Name</a>
            <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleJoinRoomButtonClick}>Join room</button>
        </div>
    )
}

export default Join;