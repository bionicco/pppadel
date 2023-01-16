import { Component, OnInit } from '@angular/core';
import { GdocService } from './services/gdoc.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'p.p.padel';

  constructor(
    private gdocSErvice: GdocService,
    private primengConfig: PrimeNGConfig
  ) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
