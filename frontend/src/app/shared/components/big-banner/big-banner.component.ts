import { Component, Input } from '@angular/core';
import { BigBannerType } from "../../../../types/big-banner.type";
import { PopupService } from "../../services/popup.service";
import { PopupEnumType } from "../../../../types/popup-enum.type";

@Component({
  selector: 'big-banner',
  templateUrl: './big-banner.component.html',
  styleUrls: ['./big-banner.component.scss']
})
export class BigBannerComponent {

  @Input() banner!: BigBannerType;

constructor(private popupService: PopupService) {
}

  sendServiceName(serviceName: string) {
    this.popupService.dataSender(serviceName);
  }
}
