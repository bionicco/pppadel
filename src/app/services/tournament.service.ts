import { EventEmitter, Injectable } from '@angular/core';
import { gdocResult, gdocTeam } from '../models/gdocs';
import { TournamentResult, TournamentTeam, TournamentWinningTeam } from '../models/tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  public newData: EventEmitter<TournamentResult[]> = new EventEmitter<TournamentResult[]>();

  public results: TournamentResult[] = [];

  public teams: TournamentTeam[] = [];

  public teamNames: gdocTeam[] = []

  public winningTeams: TournamentWinningTeam[] = [];


  constructor() { }

  calculator(results: gdocResult[]) {
    this.results = [];
    this.teams = [];
    this.winningTeams = [];

    results.forEach((result, index) => {
      this.results.push(this.createResult(result));

    });

    this.newData.emit(this.results);
  }

  setTeamNames(teams: gdocTeam[]) {
    this.teamNames = teams;
  }

  getTeamName(player1: string, player2: string): string {
    const team = this.teamNames.find(team => (team['Giocatore 1'].toLowerCase() === player1.toLowerCase() && team['Giocatore 2'].toLowerCase() === player2.toLowerCase()) || (team['Giocatore 1'].toLowerCase() === player2.toLowerCase() && team['Giocatore 2'].toLowerCase() === player1.toLowerCase()));
    if (team) {
      return team['Nome squadra'];
    }
    return '';
  }

  private createResult(gResult: gdocResult): TournamentResult {
    const score: number[] = [this.parseNumber(gResult['Risultato A']), this.parseNumber(gResult['Risultato B'])];
    const gamesToWin: number = this.parseNumber(gResult['Games to win']);
    const code: string = gResult['Code'];
    const teams = this.createTeams([gResult['Giocatore A1'], gResult['Giocatore A2']], [gResult['Giocatore B1'], gResult['Giocatore B2']], score, code);

    return {
      teams,
      score,
      gamesToWin,
      code,
    }
  }

  parseNumber(value: string): number {
    const res = Number.parseInt(value);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  }

  private createTeams(playersNamesA: string[], playersNamesB: string[], score: number[], code: string): TournamentTeam[] {

    const teamA = this.getTeam(playersNamesA[0], playersNamesA[1]);
    const teamB = this.getTeam(playersNamesB[0], playersNamesB[1]);

    if (this.isFinal(code) && (score[0] || score[1])) {
      const winTeamA: TournamentWinningTeam = { players: [playersNamesA[0], playersNamesA[1]], position: this.isFinal(code) };
      const winTeamB: TournamentWinningTeam = { players: [playersNamesB[0], playersNamesB[1]], position: this.isFinal(code) };
      // Update winning teams
      if (score[0] > score[1]) {
        winTeamB.position += 1;
      } else {
        winTeamA.position += 1;
      }

      this.winningTeams.push(winTeamA);
      this.winningTeams.push(winTeamB);

    } else {
      // Update teams
      if (teamA.players[0] && teamA.players[1] && teamB.players[0] && teamB.players[1]) {
        this.updateTeam(teamA, score);
        this.updateTeam(teamB, [...score].reverse());

      }
    }



    return [teamA, teamB];
  }

  private isFinal(code: string): number {
    switch (code.split('-')[1].toLocaleUpperCase()) {
      case 'F3':
        return 3;
      case 'F1':
        return 1;
      default:
        return 0;
    }
  }

  getTeam(player1: string, player2: string): TournamentTeam {

    let team = this.teams.find(t => t.players[0] == player1 && t.players[1] == player2 || t.players[0] == player2 && t.players[1] == player1);

    if (!team) {
      team = {
        players: [player1, player2],
        totalPoints: 0,
        totalSetPlayed: 0,
        totalSetWon: 0,
        totalGamesPlayed: 0,
        totalGamesWon: 0,
      }
    }

    return team;
  }




  private updateTeam(team: TournamentTeam, score: number[]) {
    if (score[0] || score[1]) {
      team.totalGamesPlayed += score[0] + score[1];
      team.totalGamesWon += score[0];
      team.totalSetPlayed += 1;
      if (score[0] > score[1]) {
        team.totalSetWon += 1;
      }

      team.totalPoints += this.getPoints(score[0], score[1]);
    }

    this.saveTeam(team);
  }

  private getPoints(myGames: number, theirGames: number): number {
    let res = 0;
    if (myGames > theirGames) {
      res += 10 + 5 - theirGames;
    } else {
      res += myGames;
    }
    return res;
  }

  private saveTeam(team: TournamentTeam) {
    const index = this.teams.findIndex(t => t.players[0] == team.players[0] && t.players[1] == team.players[1] || t.players[0] == team.players[1] && t.players[1] == team.players[0]);
    if (index >= 0) {
      this.teams[index] = team;
    } else {
      this.teams.push(team);
    }
  }


}
