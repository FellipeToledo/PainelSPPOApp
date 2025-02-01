import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Mapa'
    },
    children: [
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full'
      },
      {
        path: 'map',
        loadComponent: () => import('./map.component').then(m => m.MapComponent),
        data: {
          title: 'Mapa Operacional'
        }
      },
      {
        path: 'typography',
        loadComponent: () => import('./typography.component').then(m => m.TypographyComponent),
        data: {
          title: 'Typography'
        }
      }
    ]
  }
];

