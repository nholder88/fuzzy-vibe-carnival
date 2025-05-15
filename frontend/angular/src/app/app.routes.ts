import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'households',
    pathMatch: 'full',
  },
  {
    path: 'households',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/household/household-list/household-list.component'
          ).then((m) => m.HouseholdListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './components/household/household-create/household-create.component'
          ).then((m) => m.HouseholdCreateComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './components/household/household-detail/household-detail.component'
          ).then((m) => m.HouseholdDetailComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'households',
  },
];
