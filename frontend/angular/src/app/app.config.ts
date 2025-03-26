import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import { authInterceptor } from './services/auth.interceptor';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { householdReducer } from './store/household/household.reducer';
import { choresReducer } from './store/chores/chores.reducer';
import { HouseholdEffects } from './store/household/household.effects';
import { ChoresEffects } from './store/chores/chores.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideStore({
      user: userReducer,
      household: householdReducer,
      chores: choresReducer,
    }),
    provideEffects(),
    provideEffects([UserEffects, HouseholdEffects, ChoresEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
