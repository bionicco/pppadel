import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GdocService {

  constructor(
    private http: HttpClient

  ) { }

  public getCooker(): Observable<any> {
    const sheetno = "o6isq5z"
    const sheetid = "1GLoPM2OKSGQPypZeBL3uCl4diAi4YXLye-LrXIx4jr4"
    const url =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIjbA_yORhfJjI3a3M0ctLLHn7GfEYOVpqnVPFUoQjPoRwH66tawktWiP3XqEV0f6eJ2q7xElaPK2q/pubhtml?gid=0&single=true'
    // `https://spreadsheets.google.com/feeds/list/${sheetid}/${sheetno}/public/values?alt=json`;

    return this.http.get(url)
      .pipe(
        map((res: any) => {
          console.log("------- ~ GdocService ~ map ~ res", res);
          const data = res.feed.entry;

          const returnArray: Array<any> = [];
          if (data && data.length > 0) {
            data.forEach((entry: any) => {
              const obj: any = {};
              for (const x in entry) {
                if (x.includes('gsx$') && entry[x].$t) {
                  const idx: string = x.split('$')[1];
                  obj[idx] = entry[x]['$t'];
                }
              }
              returnArray.push(obj);
            });
          }
          return returnArray;
        })
      );
  }
}
