import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isShowed$ = new Subject<boolean>();

  constructor() {
  }

  show(): void {
    this.isShowed$.next(true);
  }

  hide(): void {
    setTimeout(() => { // имитация задержки сервера
      this.isShowed$.next(false);
    }, 500);
  }
}
