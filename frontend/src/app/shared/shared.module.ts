import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadersComponent } from './components/loader/loaders.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { OurServicesCardComponent } from './components/our-services-card/our-services-card.component';
import { BigBannerComponent } from './components/big-banner/big-banner.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { OrderPopupComponent } from './components/order-popup/order-popup.component';
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelect, MatSelectModule } from "@angular/material/select";


@NgModule({
  declarations: [
    LoadersComponent,
    OurServicesCardComponent,
    BigBannerComponent,
    ArticleCardComponent,
    OrderPopupComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [LoadersComponent, OurServicesCardComponent, BigBannerComponent, ArticleCardComponent, OrderPopupComponent],
})
export class SharedModule {
}
