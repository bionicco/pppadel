import { EventEmitter, Injectable } from '@angular/core';
import { gdocResult } from '../models/gdocs';
import { Player, Result } from '../models/result';
import { TournamentResult, TournamentTeam } from '../models/tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  public newData: EventEmitter<TournamentResult[]> = new EventEmitter<TournamentResult[]>();

  public results: TournamentResult[] = [];

  public teams: TournamentTeam[] = [];


  constructor() { }

  calculator(results: gdocResult[]) {
    this.results = [];
    this.teams = [];

    results.forEach((result, index) => {
      this.results.push(this.createResult(result));

    });

    this.newData.emit(this.results);

  }

  private createResult(gResult: gdocResult): TournamentResult {
    console.log("------- ~ TournamentService ~ createResult ~ gResult", gResult);
    const score: number[] = [this.parseNumber(gResult['Risultato A']), this.parseNumber(gResult['Risultato B'])];
    const gamesToWin: number = this.parseNumber(gResult['Games to win']);
    const teams = this.createTeams([gResult['Giocatore A1'], gResult['Giocatore A2']], [gResult['Giocatore B1'], gResult['Giocatore B2']], score);

    return {
      teams,
      score,
      gamesToWin
    }
  }

  parseNumber(value: string): number {
    const res = Number.parseInt(value);
    if (isNaN(res)) {
      return 0;
    }
    return res;
  }

  private createTeams(playersNamesA: string[], playersNamesB: string[], score: number[]): TournamentTeam[] {

    const teamA = this.getTeam(playersNamesA[0], playersNamesA[1]);
    const teamB = this.getTeam(playersNamesB[0], playersNamesB[1]);

    // Update teams
    this.updateTeam(teamA, score);
    this.updateTeam(teamB, [...score].reverse());


    return [teamA, teamB];
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
    team.totalGamesPlayed += score[0] + score[1];
    team.totalGamesWon += score[0];
    team.totalSetPlayed += 1;
    if (score[0] > score[1]) {
      team.totalSetWon += 1;
    }

    team.totalPoints += this.getPoints(score[0], score[1]);

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
