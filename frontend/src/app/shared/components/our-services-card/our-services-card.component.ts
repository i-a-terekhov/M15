import { Component, Input } from '@angular/core';
import { OurServiceType } from "../../../../types/our-service.type";

@Component({
  selector: 'our-services-card',
  templateUrl: './our-services-card.component.html',
  styleUrls: ['./our-services-card.component.scss']
})
export class OurServicesCardComponent {

  @Input() ourService!: OurServiceType;

  constructor() {
  }
}
