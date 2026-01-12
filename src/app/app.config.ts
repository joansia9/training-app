import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { FhssConfig, provideFhss } from '@fhss-web-team/frontend-utils';
import { DEFAULT_HOME_PAGES, ROLE_PERMISSION_MAP } from '../security';
import { provideTrpc } from './utils/trpc.client';

const fhssConfig: FhssConfig = {
  rolePermissionMap: ROLE_PERMISSION_MAP,
  defaultHomePages: DEFAULT_HOME_PAGES,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFhss(fhssConfig),
    provideTrpc(),
  ],
};
