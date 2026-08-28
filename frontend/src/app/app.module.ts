import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { MainComponent } from './pages/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatMenuModule } from "@angular/material/menu";
import { CarouselModule } from "ngx-owl-carousel-o";
import { AuthInterceptor } from "./core/auth/auth.interceptor";
import { SharedModule } from "./shared/shared.module";
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleComponent } from './pages/article/article.component';
import { TermsComponent } from './pages/terms/terms.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    MainComponent,
    BlogComponent,
    ArticleComponent,
    TermsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    SharedModule,
    CarouselModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
