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
                    <div className='player-container' key={player.id} style={{ color: player.buzzTime === fastestTime ? 'green' : undefined }}>
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
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const navigate = useNavigate();
    const buzzedAudio = new Audio('./assets/buzzed.wav');
    const errorAudio = new Audio('./assets/error.wav');

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
        if (room?.players[0]?.buzzTime && answerTime !== 0 && !isMuted) {
            buzzedAudio.play();
            const timer = setTimeout(() => {
                errorAudio.play();
            }, answerTime * 1000);

            return () => clearTimeout(timer);
        }
    }, [room?.players[0]?.buzzTime]);

    const handleBuzzReset = () => {
        socket?.emit('room:reset', room?.id);
    };

    const handleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleAnswerTimeBlur = () => {
        if (answerTime > 60) {
            setAnswerTime(60);
        } else if (answerTime < 0) {
            setAnswerTime(0);
        }
    }

    return (
        <div className='host-container'>
            {room ? (
                <>
                    <h1>Room ID: {room.id}</h1>
                    <button className='mute-button' onClick={handleMute}>{isMuted ? '🔇' : '🔈'}</button>
                    <div className='input-container'>
                        <p>Buzzer time:</p>
                        <input 
                            type='number' 
                            min='0' max='60' 
                            value={answerTime} 
                            onChange={(e) => setAnswerTime(Number(e.target.value))}
                            onBlur={handleAnswerTimeBlur}
                        />
                    </div>
                    <button onClick={handleBuzzReset}>Reset Buzzers</button>
                    <Players players={room.players} />
                </>
            ) : (
                <p>Creating room..</p>
            )}
        </div>
    )
};

export default Host;