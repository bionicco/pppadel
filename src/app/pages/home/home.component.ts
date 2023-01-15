import { Component } from '@angular/core';
import { Player, Result } from 'src/app/models/result';
import { AlgoService } from 'src/app/services/algo.service';
import { GdocService } from 'src/app/services/gdoc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public results: Result[] = [];
  public players: Player[] = [];

  constructor(
    private algoService: AlgoService,
    private gdocService: GdocService
  ) {
    this.gdocService.getResults().subscribe(res => {
      return
    })

    this.algoService.newData.subscribe((res) => {
      this.results = res;
      this.players = this.algoService.players;
    });
  }

}
