import { Component } from '@angular/core';
import { GdocService } from './gdoc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'padel';

  constructor(
    private gdocSErvice: GdocService
  ) {
    this.gdocSErvice.getCooker().subscribe(res => {
      console.log("------- ~ AppComponent ~ this.gdocSErvice.getCooker ~ res", res);
      return

    })
  }
}
