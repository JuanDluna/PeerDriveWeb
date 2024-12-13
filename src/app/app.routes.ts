import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'passenger', component: PassengerHomeComponent},
    {path:  '**', pathMatch:"full", redirectTo: 'login'}
];
