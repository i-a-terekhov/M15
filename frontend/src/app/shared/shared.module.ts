import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { OurServicesCardComponent } from './components/our-services-card/our-services-card.component';
import { BigBannerComponent } from './components/big-banner/big-banner.component';


@NgModule({
  declarations: [
    LoaderComponent,
    OurServicesCardComponent,
    BigBannerComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [LoaderComponent, OurServicesCardComponent, BigBannerComponent],
})
export class SharedModule {
}
