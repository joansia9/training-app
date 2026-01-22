import { Routes } from '@angular/router';
import {
  AuthErrorPage,
  ForbiddenPage,
  NotFoundPage,
  permissionGuard,
  ServerErrorPage,
} from '@fhss-web-team/frontend-utils';
import { HomePage } from './pages/home/home.page';
import { DefaultLayout } from './layouts/default/default.layout';
import { AdminPage } from './pages/admin/admin.page';
import { Permission } from '../security';
import { TasksPage } from './pages/tasks/tasks.page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: 'admin',
        component: AdminPage,
        canActivate: [permissionGuard<Permission>(['view-secret'])],
      },
      {
        path: 'task',
        component: TasksPage,
        canActivate: [permissionGuard<Permission>(['manage-task'])],
      },
      { path: 'server-error', component: ServerErrorPage },
      { path: 'forbidden', component: ForbiddenPage },
      { path: 'auth-error', component: AuthErrorPage },
      { path: '', pathMatch: 'full', component: HomePage },
      { path: '**', component: NotFoundPage },
    ],
  },
];
