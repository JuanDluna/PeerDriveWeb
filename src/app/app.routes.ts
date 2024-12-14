import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { DriverHomeComponent } from './driver-home/driver-home.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'passenger', component: PassengerHomeComponent},
    {path: 'driver', component: DriverHomeComponent},
    {path: 'home', component: HomeComponent },
    {path:  '**', pathMatch:"full", redirectTo: 'home'}
];
