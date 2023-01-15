export interface TournamentResult {
    teams: TournamentTeam[];
    score: number[];
    gamesToWin: number;
}

export interface TournamentTeam {
    players: string[];
    totalPoints: number;
    totalSetPlayed: number;
    totalSetWon: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
}
