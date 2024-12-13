import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { DriverHomeComponent } from './driver-home/driver-home.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'passenger', component: PassengerHomeComponent},
    {path: 'driver', component: DriverHomeComponent},
    {path:  '**', pathMatch:"full", redirectTo: 'login'}
];
