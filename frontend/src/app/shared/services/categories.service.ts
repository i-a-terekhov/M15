import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { delay, map, Observable } from "rxjs";
import { CategoryRawType, CategoryType } from "../../../types/categoryRawType";
import { DefaultResponseType } from "../../../types/default-response.type";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public readonly categoriesNames$: Observable<string[]> = this.getCategoriesNamesFromServer();
  public readonly categoriesObjects$: Observable<CategoryType[]> = this.getCategoriesObjFromServer();

  constructor(private http: HttpClient) {
  }

  private getCategoriesNamesFromServer(): Observable<string[]> {
    return this.http.get<DefaultResponseType | CategoryRawType[]>(`${environment.api}categories`)
      .pipe(
        delay(3000),  // имитация задержки соединения: при задержке не показывается попап - только снекбар
        map((data: DefaultResponseType | CategoryRawType[]) => {
          if ('error' in data) {
            throw new Error(data.message);
          }
          return data.length > 0 ? data.map(cat => cat.name) : [];
        })
      );
  }

  private getCategoriesObjFromServer(): Observable<CategoryType[]> {
    return this.http.get<DefaultResponseType | CategoryRawType[]>(`${environment.api}categories`)
      .pipe(
      map((data: DefaultResponseType | CategoryRawType[]) => {
        if ('error' in data) {
          throw new Error(data.message);
        }
        return data.length > 0 ? data.map(cat => ({name: cat.name, url: cat.url, selected: false})) : [];
      })
    )
  }
}
