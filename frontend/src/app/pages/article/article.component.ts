import { Component } from '@angular/core';
import { environment } from "../../../environments/environment";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { forkJoin, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { FullArticleType, FullCommentsType } from "../../../types/fullArticle.type";
import { ArticlesService } from "../../shared/services/articles.service";
import { CommentsService } from "../../shared/services/comments.service";
import { CommentReactionType, ReactionActionType } from "../../../types/comments.type";
import { ArticleType } from "../../../types/articles.type";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {

  private destroy$ = new Subject<void>();

  isLogged: boolean = false;

  staticPathForImages = environment.serverImages;
  image404path = 'assets/images/blank-pictures/article-card-notfound-picture.png';
  userWithoutPicPath = 'assets/images/blank-pictures/user-without-photo.png';

  fullArticle?: FullArticleType;
  cleanHtmlArticleBody: string = '';
  appearedComments: FullCommentsType[] = [];
  userReactionByCommentId = new Map<string, ReactionActionType>();

  relatedArticleCards: ArticleType[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private commentsService: CommentsService,
              private snackBar: MatSnackBar,
  ) {
    this.isLogged = authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => this.isLogged = isLoggedIn);

    this.activatedRoute.paramMap
      .pipe(
        switchMap((paramMap: ParamMap) => {
          const url = paramMap.get('url');
          return url ? this.articlesService.getFullArticle(url) : of(null);
        }),
        switchMap(article => {
          if (!article) return of(null);

          return forkJoin({
            article: of(article),
            related: this.articlesService.getRelatedArticles(article.url)
          });
        }),
        takeUntil(this.destroy$) // Защита от утечки памяти
      )
      .subscribe({
        next: (data) => {
          if (!data) return;

          const { article, related } = data;

          this.fullArticle = article;
          this.cleanHtmlArticleBody = this.removeFirstElements(article.text);
          this.appearedComments = [...article.comments];
          this.relatedArticleCards = related;

          if (this.isLogged) {
            this.loadUserReactions(article.id);
          }
        },
        error: (err) => {
          console.error(err.message);
          this.router.navigate(['blog']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFirstElements(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Удаляем заголовок и первый абзац, т.к. получаем их отдельно
    const firstH1 = doc.querySelector('h1');
    if (firstH1) {
      firstH1.remove();
    }
    const firstP = doc.querySelector('p');
    if (firstP) {
      firstP.remove();
    }
    return doc.body.innerHTML;
  }

  get imageUrl(): string {
    const img = this.fullArticle?.image;

    if (!img) {
      return this.image404path;
    }
    if (img.startsWith('assets/') || img.startsWith('http')) {
      return img;
    }
    return this.staticPathForImages + img;
  }

  getMoreComments() {
    this.commentsService.getMoreComments({
      offset: this.appearedComments.length,
      article: this.fullArticle!.id
    })
      .subscribe(newPortionOfComments => {
        this.appearedComments = [...this.appearedComments, ...newPortionOfComments.comments]; // перезапись позволит
      })
  }

  private loadUserReactions(articleId: string): void {
    this.commentsService.getUserReactions(articleId)
      .subscribe({
        next: (reactions: CommentReactionType[]) => {
          const reactionMap = new Map<string, ReactionActionType>();

          reactions.forEach(reaction => {
            reactionMap.set(
              reaction.comment,
              reaction.action
            );
          });
          this.userReactionByCommentId = reactionMap;
        }
      })
  }

  postUserComment(textarea: HTMLTextAreaElement): void {
    const commentText = textarea.value.trim();
    if (!commentText || !this.fullArticle) {
      return;
    }

    const articleId = this.fullArticle.id;

    this.commentsService.postUserComment(articleId, commentText)
      .pipe(
        tap(() => {
          textarea.value = '';
        }),
        switchMap(() =>
          this.commentsService.getMoreComments({
            offset: 0,
            article: articleId
          })
        )
      )
      .subscribe({
        next: commentsData => {
          this.appearedComments = [...commentsData.comments];

          if (this.fullArticle) {
            this.fullArticle = {
              ...this.fullArticle,
              comments: [...commentsData.comments],
              commentsCount: this.fullArticle.commentsCount + 1
            };
          }
        },

        error: err => {
          console.error(err.message);
        }
      })
  }

  postUserReaction(commentId: string, action: ReactionActionType) {
    const previousAction = this.userReactionByCommentId.get(commentId) ?? null;
    const nextAction = previousAction === action ? null : action;

    this.commentsService.postUserReaction(commentId, action)
      .subscribe({
        next: response => {
          if (action === 'like' || action === 'dislike') {
            this.updateCommentCounters(commentId, previousAction, nextAction);
            this.snackBar.open('Ваш голос учтен')
          }

          if (action === 'violate') {
            this.snackBar.open('Жалоба отправлена')
          }

          if (this.fullArticle) {
            this.loadUserReactions(this.fullArticle.id);
          }
        },
        error: err => {
          if (err.error.message && err.error.message === 'No auth token') {
            this.snackBar.open('Чтобы отреагировать, нужно быть залогиненым')
          }

          if (err.error.message && err.error.message === 'Это действие уже применено к комментарию') {
            this.snackBar.open('Жалоба уже отправлена')
          }

        }
      })
  }

  private updateCommentCounters(commentId: string, previousAction: ReactionActionType | null, nextAction: ReactionActionType | null): void {
    this.appearedComments =
      this.appearedComments.map(comment => {
        if (comment.id !== commentId) {
          return comment;
        }

        let likesCount = comment.likesCount;
        let dislikesCount = comment.dislikesCount;

        if (previousAction === 'like') {
          likesCount--;
        }

        if (previousAction === 'dislike') {
          dislikesCount--;
        }

        if (nextAction === 'like') {
          likesCount++;
        }

        if (nextAction === 'dislike') {
          dislikesCount++;
        }

        return { ...comment, likesCount, dislikesCount };
      });
  }

}
