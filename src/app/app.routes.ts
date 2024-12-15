import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PassengerHomeComponent } from './passenger-home/passenger-home.component';
import { DriverHomeComponent } from './driver-home/driver-home.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'passenger', component: PassengerHomeComponent},
    {path: 'driver', component: DriverHomeComponent},
    {path: 'home', component: HomeComponent },
    {path: 'about', component: AboutComponent },
    {path: 'help', component: FaqComponent },
    {path: 'contact', component: ContactComponent },
    {path:  '**', pathMatch:"full", redirectTo: 'home'}
];
