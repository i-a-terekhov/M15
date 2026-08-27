import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { CommentReactionType, ReactionActionType } from "../../../types/comments.type";
import { DefaultResponseType } from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getMoreComments(params: { offset: number, article: string }): Observable<any> {
    return this.http.get<{ allCount: number, comments: [] }>(`${environment.api}comments`, { params });
  }

  getUserReactions(articleId: string): Observable<CommentReactionType[]> {
    return this.http.get<CommentReactionType[]>(`${environment.api}comments/article-comment-actions?articleId=` + articleId);
  }

  postUserComment(articleId: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/`, { 'text': text, 'article': articleId });
  }

  postUserReaction(commentId: string, action: ReactionActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(`${environment.api}comments/` + commentId + '/apply-action', { 'action': action });
  }
}
