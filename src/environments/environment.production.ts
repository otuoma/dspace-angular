import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular Universal settings
  universal: {
    preboot: true,
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
