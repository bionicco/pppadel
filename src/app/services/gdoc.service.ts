import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { gdocResult } from '../models/gdocs';
import { AlgoService } from './algo.service';

@Injectable({
  providedIn: 'root'
})
export class GdocService {

  constructor(
    private http: HttpClient,
    private papa: Papa,
    private algoService: AlgoService
  ) { }

  public getResults(): Observable<any> {
    const url =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIjbA_yORhfJjI3a3M0ctLLHn7GfEYOVpqnVPFUoQjPoRwH66tawktWiP3XqEV0f6eJ2q7xElaPK2q/pub?gid=0&single=true&output=csv'
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map((res: any) => {
          console.log("------- ~ GdocService ~ map ~ res", res);
          this.papa.parse(res, {
            header: true,
            complete: (result) => {
              const parsed = result.data as gdocResult[];
              this.algoService.calculator(parsed);
            }
          });
          return res;
        })
      );
  }
}
