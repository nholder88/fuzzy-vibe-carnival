import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const routes: Routes = [
  {
    path: 'chores/edit/:id',
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '',
      },
      provideHttpClient(withFetch()),
    ],
    // Skip prerendering for dynamic routes
    data: {
      renderMode: 'client-side-only',
    },
  },
];
