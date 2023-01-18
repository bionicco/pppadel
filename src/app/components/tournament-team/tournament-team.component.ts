import { Component, Input } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament.service';

const IMAGE_PATH = "assets/images/";

@Component({
  selector: 'tournament-team',
  templateUrl: './tournament-team.component.html',
  styleUrls: ['./tournament-team.component.scss']
})
export class TournamentTeamComponent {
  @Input() player1: string = '';
  @Input() player2: string = '';

  constructor(
    private tournamentService: TournamentService
  ) { }

  getTeamName(): string {
    return this.tournamentService.getTeamName(this.player1, this.player2);
  }

  getImage(playerName: string): string {
    return IMAGE_PATH + 'default.jpg';
    return IMAGE_PATH + playerName + '.jpg';
  }

}
