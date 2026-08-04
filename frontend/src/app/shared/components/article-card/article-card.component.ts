import { Component, Input } from '@angular/core';
import { ArticleType } from "../../../../types/articlesType";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  staticPathForImages = environment.serverImages;
  @Input() article!: ArticleType;

}
