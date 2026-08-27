import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ArticlesType, ArticleType } from "../../../types/articles.type";
import { ActiveQueryParamsType } from "../../../types/active-query-params.type";
import { FullArticleType } from "../../../types/fullArticle.type";

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

  getArticlesWithFilter(params: ActiveQueryParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(`${environment.api}articles`, { params });
  }

  getFullArticle(url: string): Observable<FullArticleType> {
    return this.http.get<FullArticleType>(`${environment.api}articles/` + url);
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${environment.api}articles/related/` + url);
  }
}
