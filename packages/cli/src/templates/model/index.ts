export { basicModelTemplate } from './basic.js';
export { fullModelTemplate } from './full.js';
export { withRelationsModelTemplate } from './with-relations.js';

export const modelTemplates = {
  basic: 'basicModelTemplate',
  'with-relations': 'withRelationsModelTemplate',
  full: 'fullModelTemplate',
} as const;
