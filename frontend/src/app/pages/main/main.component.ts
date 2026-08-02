import { Component } from '@angular/core';
import { environment } from "../../../environments/environment";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  banners = [
    {
      image: 'assets/images/banner/Image(1).png',
      additionalUpperSpace: true,
      categoryTitle: 'Предложение месяца',
      title: 'Продвижение в<br>Instagram для вашего<br>бизнеса <span>-15%</span>!',
      additionalText: '',
      additionalLowerSpace: false,
    },
    {
      image: 'assets/images/banner/Image(2).png',
      additionalUpperSpace: false,
      categoryTitle: 'Акция',
      title: 'Нужен грамотный<br><span>копирайтер</span>?',
      additionalText: 'Весь декабрь у нас действует акция<br>на работу копирайтера.',
      additionalLowerSpace: true,
    },
    {
      image: 'assets/images/banner/Image(3).png',
      additionalUpperSpace: false,
      categoryTitle: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10<br>SMM-агенств Москвы!',
      additionalText: 'Мы благодарим каждого, кто<br>голосовал за нас!',
      additionalLowerSpace: true,
    },
  ];
  bannersOwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
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
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };

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
      text: 'Прошла курс по веб-дизайну в АйтиШторме и осталась в полном восторге! Преподаватели объясняют всё на пальцах, а тонна практики помогла мне собрать первое крутое портфолио.',
    },
    {
      image: 'assets/images/reviews-cards/review2.png',
      name: 'Василиса',
      text: 'Регулярно смотрю бесплатные вебинары от АйтиШторма. Информации дают больше, чем на некоторых платных интенсивах. Настоящие профи, которые горят своим делом!',
    },
    {
      image: 'assets/images/reviews-cards/review3.png',
      name: 'Иммануил',
      text: 'АйтиШторм — это не просто школа, а мощное комьюнити единомышленников. Закрытый чат студентов помог мне найти первых заказчиков и крутых друзей по всей стране.',
    },
  ];
  reviewsOwlOptions: OwlOptions = {
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
  };


}
