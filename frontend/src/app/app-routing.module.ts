import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./shared/layout/layout.component";
import { MainComponent } from "./pages/main/main.component";
import { AuthForwardGuard } from "./core/auth/auth-forward.guard";
import { BlogComponent } from "./pages/blog/blog.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: '',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
        canActivate: [AuthForwardGuard],
      },
      { path: 'blog', component: BlogComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
