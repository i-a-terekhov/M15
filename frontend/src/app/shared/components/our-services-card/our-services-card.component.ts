import { Component, Input } from '@angular/core';
import { OurServiceType } from "../../../../types/our-service.type";
import { PopupService } from "../../services/popup.service";

@Component({
  selector: 'our-services-card',
  templateUrl: './our-services-card.component.html',
  styleUrls: ['./our-services-card.component.scss']
})
export class OurServicesCardComponent {

  @Input() ourService!: OurServiceType;

  constructor(private popupService: PopupService) {
  }

  sendServiceName(): void {
    this.popupService.dataSender(this.ourService.nameOfServiceCategory)
  }
}
