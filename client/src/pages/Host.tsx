import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import { Player, Room } from '../types';

const Players: React.FC<{ players: Player[] }> = ({ players }) => {
    return (
        (players.length === 0 ? (
            <div>Waiting for players..</div>
        ) : (
            <div>
                {players.map((player) => (
                    <div key={player.id}>
                        <p>{player.name}</p>
                        <p>{player.buzzTime ? player.buzzTime : 'Hasn\'t buzzed!'}</p>
                    </div>
                ))}
            </div>
        ))
    );
};

const Host: React.FC = () => {
    const { socket, room, setRoom } = useAppContext();
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

        socket?.on('room:updated', (room: Room) => {
            setRoom(room);
        });

        return () => {
            socket?.off('room:created');
        }
    }, [socket]);

    const handleBuzzResetButtonClick = () => {
        socket?.emit('room:reset', room?.id);
    };

    return (
        <div className='host-container'>
            <h1>Hello from host!</h1>
            <button onClick={handleBuzzResetButtonClick}>Reset buzzes</button>
            {room ? (
                <>
                    <p>Room ID: {room.id}</p>
                    <Players players={room.players} />
                </>
            ) : (
                <p>Creating room..</p>
            )}
        </div>
    )
};

export default Host;