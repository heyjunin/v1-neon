export { advancedSeederTemplate } from './advanced.js';
export { basicSeederTemplate } from './basic.js';
export { fakerSeederTemplate } from './faker.js';

export const seederTemplates = {
  basic: 'basicSeederTemplate',
  faker: 'fakerSeederTemplate',
  advanced: 'advancedSeederTemplate',
} as const;
