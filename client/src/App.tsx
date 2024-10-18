import { io, Socket } from 'socket.io-client';
import './App.css';
import { useEffect, useRef, useState } from 'react';

const URL: string = 'http://localhost:8080';

const App = () => {
    const socket = useRef<Socket>();
    const [room, setRoom] = useState<any>();
    const [name, setName] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [roomOwner, setRoomOwner] = useState<boolean>(false);

    useEffect(() => {
        try {
            socket.current = io(URL);

            socket.current.on('connect', () => {
            });

            socket.current.on('disconnect', () => {
            });

            socket.current.on('room:created', (room: any) => {
                setRoom(room);
                setRoomOwner(true);
            });

            socket.current.on('room:joined', (room: any) => {
                setRoom(room);
            });

            socket.current.on('room:buzzed', (room: any) => {
                setRoom(room);
            })

            socket.current.on('room:left', (room: any) => {
                setRoom(room);
            });

            socket.current.on('room:reseted', (room: any) => {
                setRoom(room);
            });

            return () => {
                socket.current?.disconnect();
            };
        } catch (error) {
            console.error(error);
        }    
    }, [URL]);
    
    const handleBuzzButtonClick = () => {
        socket.current?.emit('room:buzz', room.id);
    };

    const handleCreateRoomButtonClick = () => {
        socket.current?.emit('room:create');
    };

    const handleJoinRoomButtonClick = () => {
        if (roomId && name) {
            socket.current?.emit('room:join', roomId, name);
        }
    };

    const handleBuzzResetButtonClick = () => {
        socket.current?.emit('room:reset', room.id);
    };

    return (
        <div className={`app-container ${room && room.players[0]?.buzzTime && room.players[0]?.name === name ? 'winner' : room && room.players[0]?.buzzTime ? 'loser' : ''}`}>
        {/* Room creation and joining */}
        {!room &&
        <>
            <button
                className='create-room'
                onClick={handleCreateRoomButtonClick}
            >
                Create room
            </button>
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
        </>
        }
        {(room && !roomOwner) && 
            <button 
                className='buzz-button'
                onClick={handleBuzzButtonClick}
            >
                🔴
            </button>}
        {(roomOwner) && (
            <>
                <h1>Dashboard</h1>
                <h1>{room.id}</h1>
                <button onClick={handleBuzzResetButtonClick}>Reset buzzes</button>
                <h1>Players:</h1>
                {room.players
                    .map((p: any) => {
                        const fastestTime = room.players[0].buzzTime ? room.players[0].buzzTime : 0;
                        let timeDifferenceInSeconds = "";
                        if (p.buzzTime) {
                            const timeDifference = p.buzzTime - fastestTime;
                            timeDifferenceInSeconds = `+${(timeDifference / 1000).toFixed(3)} seconds`;
                        }
                        return (
                            <div key={p.name}>
                                {p.name}: {p.buzzTime ? timeDifferenceInSeconds : "Hasnt buzzed!"}
                            </div>
                        );
                })}
            </>
        )}
        </div>
    );
};

export default App;