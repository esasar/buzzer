export interface Player {
    id: string
    name: string
    buzzTime: number | null
}

export interface Room {
    id: string
    ownerId : string
    players: Player[]
}

const rooms: { [roomId: string]: Room } = {};

const generateId = () => {
    const idGen = (length: number) => {
      const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      return Array.from({ length }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
    }
  
    let id: string;
    do {
      id = idGen(4);
    } while (id in rooms);
  
    return id;
};

const createRoom = (): Room => {
    const id = generateId();

    if (id in rooms) throw new Error(`Room ${id} already exists`);

    const newRoom = {
        id,
        ownerId: null,
        players: [],
    }

    rooms[id] = newRoom;

    return newRoom;
};

const deleteRoom = (id: string) => {
    delete rooms[id];
};

const getRoom = (roomId: string) => {
    const room = rooms[roomId]
    if (!room) {
      throw new Error(`Room ${roomId} does not exist`)
    }
    return room
};

const createPlayer = (id: string, name: string) => {
    const newPlayer = {
        id,
        name,
        buzzTime: null
    };

    return newPlayer;
};

const addPlayerToRoom = (roomId: string, playerId: string, name: string) => {
    const room = getRoom(roomId);
    
    if (room.players.some(p => p.id === playerId)) throw new Error(`Player ${playerId} is already in room ${roomId}`);

    const newPlayer = createPlayer(playerId, name);
    room.players.push(newPlayer);

    return room;
};

const removePlayerFromRoom = (roomId: string, playerId: string) => {
    const room = getRoom(roomId);

    room.players = room.players.filter(p => p.id !== playerId);

    return room;
};

const buzzPlayer = (roomId: string, playerId: string) => {
    const room = getRoom(roomId);

    const player = room.players.find(p => p.id === playerId);

    if (!player) throw new Error(`Player ${playerId} is not in room ${roomId}`);
    if (player.buzzTime) throw new Error(`Player ${playerId} has already buzzed`);
    
    player.buzzTime = new Date().getTime();

    room.players.sort((a, b) => (a.buzzTime || Infinity) - (b.buzzTime || Infinity));

    return room;
};

const resetPlayerBuzzes = (roomId: string) => {
    const room = getRoom(roomId);

    room.players.forEach(p => p.buzzTime = null);

    return room;
};

const getRoomsByPlayerId = (playerId: string) => {
    return Object.values(rooms).filter(room => room.players.some(player => player.id === playerId));
};

const roomService = {
    createRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    buzzPlayer,
    resetPlayerBuzzes,
    getRoomsByPlayerId
};

export default roomService;