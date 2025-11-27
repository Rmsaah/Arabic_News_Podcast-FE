import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth.guard';
import { Episodes } from './pages/episodes/episodes';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'episodes', component: Episodes },
  { path: '**', redirectTo: '' }
];
