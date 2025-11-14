import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar-SA';

// Register Arabic locale for date pipes
registerLocaleData(localeAr, 'ar-SA');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
