export interface TournamentResult {
    teams: TournamentTeam[];
    score: number[];
    gamesToWin: number;
    code: string;
}

export interface TournamentTeam {
    players: string[];
    totalPoints: number;
    totalSetPlayed: number;
    totalSetWon: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
}

export interface TournamentWinningTeam {
    players: string[];
    position: number;
}
