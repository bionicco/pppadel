import { EventEmitter, Injectable } from '@angular/core';
import { gdocResult } from '../models/gdocs';
import { Player, Result, Team } from '../models/result';

const ALGO_CONFIG = {
  START_PLAYER_VALUE: 1000,
  THRESHOLD_76: 10,
  THRESHOLD_75: 20,
  // THRESHOLD_65: 30,
  THRESHOLD_64: 40,
  THRESHOLD_63: 50,
  THRESHOLD_62: 60,
  THRESHOLD_61: 70,
  THRESHOLD_60: 100, // for update value only
  UPDATE_FACTOR: 0.5,
}

interface TeamValues {
  sameTeamValue?: number, otherTeamValue?: number, incompleteTeamValue?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AlgoService {

  public newData: EventEmitter<Result[]> = new EventEmitter<Result[]>();

  public results: Result[] = [];

  public players: Player[] = [];


  constructor() { }

  calculator(results: gdocResult[]) {
    this.results = [];
    this.players = [];

    results.forEach((result, index) => {
      this.results.push(this.createResult(result));

    });

    this.newData.emit(this.results);

  }

  private createResult(gResult: gdocResult): Result {
    const score: number[] = [Number.parseInt(gResult['Risultato A']), Number.parseInt(gResult['Risultato B']), Number.parseInt(gResult['Games to win'])];
    const teams = this.createTeams([gResult['Giocatore A1'], gResult['Giocatore A2']], [gResult['Giocatore B1'], gResult['Giocatore B2']], score);
    const prevision = this.createPrevision(teams);
    const date = new Date();//gResult.data); // TODO check date format to parse

    return {
      date,
      teams,
      score,
      prevision
    }
  }

  private createTeams(playersNamesA: string[], playersNamesB: string[], score: number[]): Team[] {


    const teamA: Team = {
      players: [
        this.getPlayer(playersNamesA[0]),
        this.getPlayer(playersNamesA[1])
      ]
    }

    const teamB: Team = {
      players: [
        this.getPlayer(playersNamesB[0]),
        this.getPlayer(playersNamesB[1])
      ]
    }

    const prevision = this.createPrevision([teamA, teamB]);

    // Update players
    teamA.players.forEach((player: Player) => {
      this.updatePlayer(player, score, prevision, this.getTeamValues(teamA, teamB));
    });
    teamB.players.forEach((player: Player) => {
      this.updatePlayer(player, [...score].reverse(), [...prevision].reverse(), this.getTeamValues(teamB, teamA));
    });

    return [teamA, teamB];
  }

  private getTeamValues(team1: Team, team2: Team): TeamValues | undefined {
    const numberOfValues = (team1.players[0].lastValue ? 1 : 0) + (team1.players[1].lastValue ? 1 : 0) + (team2.players[0].lastValue ? 1 : 0) + (team2.players[1].lastValue ? 1 : 0)
    if (numberOfValues < 3) { return undefined; }
    const teamValues: TeamValues = {
      sameTeamValue: (team1.players[0].lastValue ? team1.players[0].lastValue : 0) + (team1.players[1].lastValue ? team1.players[1].lastValue : 0),
      otherTeamValue: (team2.players[0].lastValue ? team2.players[0].lastValue : 0) + (team2.players[1].lastValue ? team2.players[1].lastValue : 0),
      incompleteTeamValue: numberOfValues == 3,
    };
    return teamValues;

  }




  private updatePlayer(player: Player, score: number[], prevision: number[], teamValues?: TeamValues) {
    player.totalGamesPlayed += score[0] + score[1];
    player.totalGamesWon += score[0];
    player.totalSetPlayed += 1;
    if (score[0] > score[1]) {
      player.totalSetWon += 1;
    }

    if (player.lastValue) {
      if (teamValues && !teamValues.incompleteTeamValue) {
        player.value = this.calculatePlayerValue(player.lastValue, score, prevision);
      }
      else {
        // don't update with new players
      }
    } else {
      if (!teamValues || teamValues.incompleteTeamValue) {
        player.value = ALGO_CONFIG.START_PLAYER_VALUE;
      } else {
        player.value = this.calculatePlayerInitialValue(teamValues, score, prevision);
      }
    }

    this.savePlayer(player);

  }

  private savePlayer(player: Player) {
    const index = this.players.findIndex(p => p.name == player.name);
    if (index >= 0) {
      this.players[index] = player;
    } else {
      this.players.push(player);
    }
  }


  private calculatePlayerValue(lastValue: number, score: number[], prevision: number[]): number {
    const th = this.getThreshold(score, prevision);
    return lastValue + (th * ALGO_CONFIG.UPDATE_FACTOR); // TODO make update factor variable based on lastupdate
  }

  private calculatePlayerInitialValue(teamValues: TeamValues, score: number[], prevision: number[]): number {
    const th = this.getThreshold(score, prevision);
    if (teamValues.otherTeamValue && teamValues.sameTeamValue) {
      const diff = teamValues.otherTeamValue - teamValues.sameTeamValue;
      return diff + (th / 2);
    }
    return ALGO_CONFIG.START_PLAYER_VALUE;
  }

  getThreshold(realScore: number[], prevision: number[]): number {
    const score = [...realScore];
    let reverse = false;
    if (realScore[0] < realScore[1]) {
      score.reverse();
      reverse = true;
    }

    if (score[0] == 7 && score[1] == 6) {
      return ALGO_CONFIG.THRESHOLD_76 * (reverse ? -1 : 1);
    }
    if (score[0] == 7 && score[1] == 5) {
      return ALGO_CONFIG.THRESHOLD_75 * (reverse ? -1 : 1);
    }
    // if (score[0] == 6 && score[1] == 5) {
    //   return ALGO_CONFIG.THRESHOLD_65* (reverse ? -1 : 1);
    // }
    if (score[0] == 6 && score[1] == 4) {
      return ALGO_CONFIG.THRESHOLD_64 * (reverse ? -1 : 1);
    }
    if (score[0] == 6 && score[1] == 3) {
      return ALGO_CONFIG.THRESHOLD_63 * (reverse ? -1 : 1);
    }
    if (score[0] == 6 && score[1] == 2) {
      return ALGO_CONFIG.THRESHOLD_62 * (reverse ? -1 : 1);
    }
    if (score[0] == 6 && score[1] == 1) {
      return ALGO_CONFIG.THRESHOLD_61 * (reverse ? -1 : 1);
    }
    return ALGO_CONFIG.THRESHOLD_60 * (reverse ? -1 : 1);
  }

  private createPrevision(teams: Team[]): number[] {
    if (
      teams[0]?.players[0]?.lastValue &&
      teams[0]?.players[1]?.lastValue &&
      teams[1]?.players[0]?.lastValue &&
      teams[1]?.players[1]?.lastValue) {


      const teamAValue = (teams[0]?.players[0]?.lastValue + teams[0]?.players[1]?.lastValue) / 2;
      const teamBValue = (teams[1]?.players[0]?.lastValue + teams[1]?.players[1]?.lastValue) / 2;

      return this.calculatePrevision(teamAValue, teamBValue);
    }
    return [6, 6];
  }

  private calculatePrevision(teamAValue: number, teamBValue: number): number[] {
    if (teamAValue == teamBValue) {
      return [6, 6];
    }

    let invert = true;
    if (teamAValue > teamBValue) {
      invert = false;
    }

    const diff = Math.abs(teamAValue - teamBValue) * 2 / (teamAValue + teamBValue) * ALGO_CONFIG.START_PLAYER_VALUE;

    let result = [6, 0];
    if (diff < ALGO_CONFIG.THRESHOLD_76) {
      result = [7, 6];
    }
    else if (diff < ALGO_CONFIG.THRESHOLD_75) {
      result = [7, 5];
    }
    // else if (diff < ALGO_CONFIG.THRESHOLD_65) {
    //   result = [6, 5];
    // }
    else if (diff < ALGO_CONFIG.THRESHOLD_64) {
      result = [6, 4];
    }
    else if (diff < ALGO_CONFIG.THRESHOLD_63) {
      result = [6, 3];
    }
    else if (diff < ALGO_CONFIG.THRESHOLD_62) {
      result = [6, 2];
    }
    else if (diff < ALGO_CONFIG.THRESHOLD_61) {
      result = [6, 1];
    }

    if (invert)
      return result.reverse();
    else
      return result;
  }

  private getPlayer(name: string): Player {
    let p = this.players.find(player => player.name === name);
    if (p) {
      const cloneP = JSON.parse(JSON.stringify(p));
      cloneP.lastValue = cloneP.value;
      return cloneP;
    }
    return this.createPlayer(name);
  }

  private createPlayer(name: string): Player {
    const player: Player = {
      name,
      lastValue: 0,
      totalSetPlayed: 0,
      totalSetWon: 0,
      totalGamesPlayed: 0,
      totalGamesWon: 0,
    }


    return player;
  }


}
