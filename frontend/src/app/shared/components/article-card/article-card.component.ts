import { Component, Input } from '@angular/core';
import { ArticleType } from "../../../../types/articles.type";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {

  staticPathForImages = environment.serverImages;
  image404path = 'assets/images/blank-pictures/article-card-notfound-picture.png';

  @Input() article: ArticleType = {
    id: 'notfound',
    title: 'Что ж такое-то!',
    description: 'Кажется, эта карточка статьи сломалась. Попробуйте найти статью на странице блога по ссылке "Читать дальше" ниже',
    image: this.image404path,
    date: 'nodate',
    category: 'Ошибка',
    url: '/blog',
  };

  // В случае, если в <article-card> не будет передан article, необходимо взять локальную картинку. Так же локальная картинка
  // используется в некоторых случаях-заклушках. В этих случаях геттер возвращает путь картинки как есть.
  // Если картинка серверная, то геттер склеивает её путь с базовым адресом сервера.
  get imageUrl(): string {
    const img = this.article?.image;

    if (!img) {
      return this.image404path;
    }
    if (img.startsWith('assets/') || img.startsWith('http')) {
      return img;
    }
    return this.staticPathForImages + img;
  }

}
