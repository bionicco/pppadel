import { Component, Input, OnInit } from '@angular/core';
import { TournamentService } from 'src/app/services/tournament.service';

const IMAGE_PATH = "assets/avatars/";

@Component({
  selector: 'tournament-team',
  templateUrl: './tournament-team.component.html',
  styleUrls: ['./tournament-team.component.scss']
})
export class TournamentTeamComponent implements OnInit {
  @Input() player1: string = '';
  @Input() player2: string = '';

  public image1: string = '';
  public image2: string = '';
  private imageDefault = IMAGE_PATH + 'default.jpg';

  playerWithAvatars = ['adriana', 'andream', 'bene', 'carlo', 'claudio', 'david', 'default', 'giulia', 'leonardo', 'marco', 'mario', 'michelangelo', 'paola', 'andreap']
  constructor(
    private tournamentService: TournamentService
  ) { }

  ngOnInit(): void {
    this.image1 = this.getImage(this.player1);
    this.image2 = this.getImage(this.player2);
  }

  getTeamName(): string {
    return this.tournamentService.getTeamName(this.player1, this.player2);
  }

  getImage(playerName: string): string {
    const filename = playerName.toLowerCase().replace(' ', '');
    if (this.playerWithAvatars.includes(filename)) {
      return IMAGE_PATH + filename + '.jpg';
    }
    return this.imageDefault;
  }

}
