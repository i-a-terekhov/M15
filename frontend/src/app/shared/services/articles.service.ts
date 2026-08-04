import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ArticlesType, ArticleType } from "../../../types/articlesType";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  // бекэнд настроен таким образом, что все статьи получить невозможно - можно запрашивать только постранично (8 статей на страницу).
  // При этом, если не указывать в qwery-параметрах номер страницы, будет выводиться первая страница:
  getAllArticles(): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(`${environment.api}articles`);
  }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${environment.api}articles/top`);
  }
}
