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

    const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // room id can only be A-Z 0-9
        const value = e.target.value.toUpperCase();
        if (/^[A-Z0-9]*$/.test(value)) {
            setRoomId(value);
        }
    };

    return (
        <div className='join-container'>
            <h1>Join Room</h1>
            <div className='input-container'>
                <p>Room Id</p>
                <input 
                    value={roomId}
                    onChange={handleRoomIdChange}
                    maxLength={4}
                    pattern="^[A-Z0-9]*$"
                />
            </div>
            <div className='input-container'>
                <p>Name</p>
                <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={16}
                />
            </div>
            <button onClick={handleJoinRoomButtonClick}>Join room</button>
        </div>
    )
}

export default Join;