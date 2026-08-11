import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DefaultResponseType } from "../../../types/default-response.type";
import { RequestBodyType } from "../../../types/request-body.type";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  getPopularArticles(body: RequestBodyType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}requests`, body);
  }
}
