import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RegisterComponent } from './pages/indicator/register/register';
import { SelectBankComponent } from './pages/select-bank/select-bank';
import { DashboardComponent } from './pages/dashboard/dashboard'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'select-bank', component: SelectBankComponent },
  { path: 'dashboard', component: DashboardComponent }, 
  { path: '**', redirectTo: '' } 
];