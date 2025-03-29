import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maps'
    },
    children: [
      {
        path: '',
        redirectTo: 'Operational',
        pathMatch: 'full'
      },
      {
        path: 'Operational',
        loadComponent: () => import('./map/map.component').then(m => m.MapComponent),
        data: {
          title: 'Operational Map'
        }
      }
    ]
  }
];