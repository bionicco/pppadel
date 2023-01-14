import { Component } from '@angular/core';
import { GdocService } from './services/gdoc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'p.p.padel';

  constructor(
    private gdocSErvice: GdocService
  ) {
    this.gdocSErvice.getResults().subscribe(res => {
      return
    })
  }
}
