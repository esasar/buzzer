import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import { Player } from '../types';

const Players: React.FC<{ players: Player[] }> = ({ players }) => {
    // fastest player is always the first in the players list
    let fastestTime;
    if (players.length === 0) {
        fastestTime = 0;
    } else {
        fastestTime = players ? (players[0].buzzTime ? players[0].buzzTime : 0) : 0;
    }

    return (
        (players.length === 0 ? (
            <div className='players-container'>Waiting for players..</div>
        ) : (
            <div className='players-container'>
                {players.map((player) => (
                    <div className='player-container' key={player.id}>
                        <p className='name'>{player.name}</p>
                        <p className='time'>{player.buzzTime ? `+${((player.buzzTime - fastestTime) / 1000).toFixed(3)} seconds` : "Hasn't buzzed!"}</p>
                    </div>
                ))}
            </div>
        ))
    );
};

const Host: React.FC = () => {
    const { socket, room, setRoom } = useAppContext();
    const [answerTime, setAnswerTime] = useState<number>(0);
    const navigate = useNavigate();
    const audio = new Audio('/src/assets/beep.wav');

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
            socket.off('room:created');
            socket.off('room:buzz');
        }
    }, [socket, navigate, setRoom]);

    useEffect(() => {
        if (room?.players[0]?.buzzTime && answerTime !== 0) {
            const timer = setTimeout(() => {
                audio.play();
            }, answerTime * 1000);

            return () => clearTimeout(timer);
        }
    }, [room?.players[0]?.buzzTime]);

    const handleBuzzResetButtonClick = () => {
        socket?.emit('room:reset', room?.id);
    };

    return (
        <div className='host-container'>
            {room ? (
                <>
                    <h1>Room ID: {room.id}</h1>
                    <div className='input-container'>
                        <p>Answering time:</p>
                        <input type='number' min='0' max='10' value={answerTime} onChange={(e) => setAnswerTime(Number(e.target.value))}/>
                    </div>
                    <button onClick={handleBuzzResetButtonClick}>Reset Buzzers</button>
                    <Players players={room.players} />
                </>
            ) : (
                <p>Creating room..</p>
            )}
        </div>
    )
};

export default Host;