import { Component } from '@angular/core';
import { Player, Result } from 'src/app/models/result';
import { AlgoService } from 'src/app/services/algo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public results: Result[] = [];
  public players: Player[] = [];

  constructor(
    private algoService: AlgoService) {
    this.algoService.newData.subscribe((res) => {
      this.results = res;
      this.players = this.algoService.players;
    });
  }

}
