// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.production.ts`.
// `ng test --configuration test` replaces `environment.ts` with `environment.test.ts`.
// The list of file replacements can be found in `angular.json`.

import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: false,

  // Angular Universal settings
  universal: {
    preboot: false,
    async: true,
    time: false
  },
  defaultLanguage: 'en',
  languages: [{
    code: 'en',
    label: 'English',
    active: true,
  }, {
    code: 'ar',
    label: 'Arabic',
    active: true,
  }]
};
