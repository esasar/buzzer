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