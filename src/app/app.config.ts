import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideState, provideStore, StoreModule } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  clientsFeatureKey,
  reducer as clientReducer,
} from './state/client/client.reducer';
import { ClientEffects } from './state/client/client.effects';
import {
  reducer as accountReducer,
  accountsFeatureKey,
} from './state/account/account.reducer';
import { AccountEffects } from './state/account/account.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideState(clientsFeatureKey, clientReducer),
    provideHttpClient(),
    provideEffects(ClientEffects),
    provideState(accountsFeatureKey, accountReducer),
    provideEffects(AccountEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
  ],
};
