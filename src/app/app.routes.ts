import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { DriverHomeComponent } from './driver-home/driver-home.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { TripListComponent } from './trip-list/trip-list.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'pasajero', component: PassengerHomeComponent},
    {path: 'conductor', component: DriverHomeComponent},
    {path: 'home', component: HomeComponent },
    {path: 'about', component: AboutComponent },
    {path: 'help', component: FaqComponent },
    {path: 'contact', component: ContactComponent },
    {path: 'tripList', component: TripListComponent},
    {path:  '**', pathMatch:"full", redirectTo: 'home'}
];
