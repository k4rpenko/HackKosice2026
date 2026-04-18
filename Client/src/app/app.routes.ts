import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RegisterComponent } from './pages/indicator/register/register';
import { SelectBankComponent } from './pages/select-bank/select-bank';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { CardsComponent } from './pages/cards/cards';
import { CardDetailsComponent } from './pages/card-details/card-details';
import { SearchUserComponent } from './pages/search-user/search-user';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'select-bank', component: SelectBankComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  { path: 'search-user', component: SearchUserComponent },
  { path: '**', redirectTo: '' } 
];