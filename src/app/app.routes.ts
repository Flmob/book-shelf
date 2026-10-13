import { Routes } from '@angular/router';

import { Books } from './components';

export const routes: Routes = [
  {
    path: '**',
    component: Books,
  },
];
