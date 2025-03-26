import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app.config';
import { routes } from './app.routes.server';

const serverConfig = mergeApplicationConfig(appConfig, {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    {
      provide: 'ROUTES',
      useValue: routes,
    },
  ],
});

export default serverConfig;
