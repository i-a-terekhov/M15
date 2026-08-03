import { Component, Input } from '@angular/core';
import { BigBannerType } from "../../../../types/big-banner.type";

@Component({
  selector: 'big-banner',
  templateUrl: './big-banner.component.html',
  styleUrls: ['./big-banner.component.scss']
})
export class BigBannerComponent {

  @Input() banner!: BigBannerType;

}
