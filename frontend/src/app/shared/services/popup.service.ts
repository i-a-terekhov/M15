import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { PopupEnumType } from "../../../types/popup-enum.type";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  // закрытый приёмо-передатчик данных
  private dataTransceiver$ = new Subject<{selectedOptionName: string, popupType: PopupEnumType}>();

  // внешний транслятор данных, который не позволит изменить dataTransceiver$ (т.к. не имеет таких методов как экземпляр Subject)
  popupDataSource$ = this.dataTransceiver$.asObservable();

  dataSender(serviceName: string, popupType: PopupEnumType = PopupEnumType.order): void {
    this.dataTransceiver$.next({
      selectedOptionName: serviceName,
      popupType: popupType,
    });
  }

  constructor() { }

}
