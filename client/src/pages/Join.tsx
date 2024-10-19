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
        <div className='join-container'>
            <h1>Join Room</h1>
            <div className='input-container'>
                <p>Room Id</p>
                <input 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
            </div>
            <div className='input-container'>
                <p>Name</p>
                <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button onClick={handleJoinRoomButtonClick}>Join room</button>
        </div>
    )
}

export default Join;