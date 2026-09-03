import { Component } from '@angular/core';
import { PopupService } from "../../services/popup.service";
import { PopupEnumType } from "../../../../types/popup-enum.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private popupService: PopupService) {
  }

  sendConsultRequest(): void {
    this.popupService.dataSender('Консультация', PopupEnumType.consultation)
  }
}
