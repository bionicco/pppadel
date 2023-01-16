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

    this.tournamentService.newData.subscribe((res) => {
      this.results = res;
      this.teams = this.tournamentService.teams.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
      this.winningTeams = this.tournamentService.winningTeams.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    });

  }

  getMatchName(code: string): string {
    switch (code.split('-')[1].toLocaleUpperCase()) {
      case 'F3':
        return 'Finale terzo e quarto posto';
      case 'F1':
        return 'Finale primo e secondo posto';
      default:
        return '';
    }
  }
}
