import { Component } from '@angular/core';
import { environment } from "../../../environments/environment";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  reviews = [
    {
      image: 'assets/images/reviews-cards/review-01.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      image: 'assets/images/reviews-cards/review-02.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'assets/images/reviews-cards/review-03.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
    {
      image: 'assets/images/reviews-cards/review1.png',
      name: 'Глаша',
      text: 'Всё супер!',
    },
    {
      image: 'assets/images/reviews-cards/review2.png',
      name: 'Василиса',
      text: 'Всё более супер, чем супер!',
    },
    {
      image: 'assets/images/reviews-cards/review3.png',
      name: 'Иммануил',
      text: 'Всё настолько супер, что более супер, менее супер, чем этот супер! Молодцы! Ваще ребята!',
    },
  ];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
}
