import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RegisterComponent } from './pages/indicator/register/register';
import { LoginComponent } from './pages/indicator/login/login';
import { SelectBankComponent } from './pages/select-bank/select-bank';
import { DashboardComponent } from './pages/dashboard/dashboard'; 
import { CardsComponent } from './pages/cards/cards';
import { CardDetailsComponent } from './pages/card-details/card-details';
import { SearchUserComponent } from './pages/search-user/search-user';
import { FriendsComponent } from './pages/friends/friends';
import { TransferComponent } from './pages/transfer/transfer';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'select-bank', component: SelectBankComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  { path: 'search-user', component: SearchUserComponent },
  { path: 'friends', component: FriendsComponent }, 
  { path: 'transfer', component: TransferComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' } 
];