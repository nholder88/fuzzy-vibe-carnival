import { Routes } from '@angular/router';
import { ChoresListComponent } from './chores-list/chores-list.component';
import { ChoreFormComponent } from './chore-form/chore-form.component';

export const CHORES_ROUTES: Routes = [
  { path: '', component: ChoresListComponent },
  { path: 'new', component: ChoreFormComponent },
  { path: 'edit/:id', component: ChoreFormComponent },
];
