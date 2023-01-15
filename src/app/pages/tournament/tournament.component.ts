import { Component } from '@angular/core';
import { TournamentResult, TournamentTeam } from 'src/app/models/tournament';
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

  constructor(
    private tournamentService: TournamentService,
    private gdocService: GdocService
  ) {
    this.gdocService.getTournament().subscribe(res => {
      return
    })
    this.tournamentService.newData.subscribe((res) => {
      this.results = res;
      this.teams = this.tournamentService.teams.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
    });

  }



}
