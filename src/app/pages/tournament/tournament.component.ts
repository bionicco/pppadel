import { Component } from '@angular/core';
import { TournamentResult, TournamentTeam, TournamentWinningTeam } from 'src/app/models/tournament';
import { GdocService } from 'src/app/services/gdoc.service';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent {

  public results: TournamentResult[] = [];
  public teams: TournamentTeam[] = [];
  public winningTeams: TournamentWinningTeam[] = [];

  // public titleColors = ['#7c4dff', '#0091ea', '#ff9100', '#ff1744']

  constructor(
    private tournamentService: TournamentService,
    private gdocService: GdocService
  ) {
    setInterval(() => {
      this.gdocService.getTournament().subscribe(res => {
        return
      })
    }, 1000 * 30);
    this.gdocService.getTournament().subscribe(res => {
      return
    })
    this.gdocService.getTeams().subscribe(res => {
      return
    })


    this.tournamentService.newData.subscribe((res) => {
      this.results = res;
      this.teams = this.tournamentService.teams.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
      this.winningTeams = this.tournamentService.winningTeams.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    });

  }

  validMatch(match: TournamentResult): boolean {
    return match.teams[0].players[0] !== '' && match.teams[0].players[1] !== '' && match.teams[1].players[0] !== '' && match.teams[1].players[1] !== '';
  }


}
