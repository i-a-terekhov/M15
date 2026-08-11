import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { delay, map, Observable } from "rxjs";
import { CategoryType } from "../../../types/category.type";
import { DefaultResponseType } from "../../../types/default-response.type";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public readonly categories$: Observable<string[]> = this.getCategoriesFromServer();

  constructor(private http: HttpClient) {
  }

  private getCategoriesFromServer(): Observable<string[]> {
    return this.http.get<DefaultResponseType | CategoryType[]>(`${environment.api}categories`)
      .pipe(
        delay(3000),  // имитация задержки соединения: при задержке не показывается попап - только снекбар
        map((data: DefaultResponseType | CategoryType[]) => {
          if ('error' in data) {
            throw new Error(data.message);
          }
          return data.length > 0 ? data.map(cat => cat.name) : [];
        })
      );
  }
}
