import { Component, OnInit } from '@angular/core';
import { GdocService } from './gdoc.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'padel';

  constructor(
    private gdocSErvice: GdocService,
    private primengConfig: PrimeNGConfig
  ) {
    this.gdocSErvice.getCooker().subscribe(res => {
      console.log("------- ~ AppComponent ~ this.gdocSErvice.getCooker ~ res", res);
      return

    })
  }

  ngOnInit() {

  }
