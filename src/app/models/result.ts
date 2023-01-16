export interface Result {
    date: Date;
    teams: Team[];
    score: number[];
    prevision: number[]
}

export interface Team {
    players: Player[];
}

export interface Player {
    name: string;
    lastValue?: number;
    value?: number;
    totalSetPlayed: number;
    totalSetWon: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    lastUodate?: Date;
}