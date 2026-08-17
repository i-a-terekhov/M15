import { Component } from '@angular/core';
import { ArticlesType, ArticleType } from "../../../types/articles.type";
import { ArticlesService } from "../../shared/services/articles.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  currentPage: number = 1;
  currentArticlesCount: number = 0;
  totalAmountOfPages: number = 1;
  currentArticlesData: ArticleType[] = [];

  ifPrevArrowAllowed: boolean = true;
  ifNextArrowAllowed: boolean = true;

  constructor(private articlesService: ArticlesService) {
  }

  ngOnInit() {
    this.articlesService.getAllArticles()
      .subscribe((data: ArticlesType) => {
        if (data && data.count > 0) {
          this.currentArticlesCount = data.count;
          this.totalAmountOfPages = data.pages;
          this.currentArticlesData = data.items;
        }
        if (this.currentPage === 1) {
          this.ifPrevArrowAllowed = false;
        }
        if (this.currentPage === this.totalAmountOfPages) {
          this.ifNextArrowAllowed = false;
        }
      })
  }

}
