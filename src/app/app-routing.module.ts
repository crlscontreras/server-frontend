import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { UserListingComponent } from './components/user-listing/user-listing.component';

const routes: Routes = [
  { component: LoginComponent, path: 'login' },
  { component: RegisterComponent, path: 'register' },
  { component: HomeComponent, path: '', canActivate: [AuthGuard] },
  { component: UserListingComponent, path: 'user', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
