import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageService } from '@core/i18n/language.service';
import { registerAppIcons } from '@core/icons/icon.registry';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withXhr()),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (languageService: LanguageService) => () => languageService.init(),
      deps: [LanguageService],
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (iconLibrary: FaIconLibrary) => () => registerAppIcons(iconLibrary),
      deps: [FaIconLibrary],
    },
  ],
};
