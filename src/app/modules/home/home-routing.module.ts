import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',component: HomeComponent, children: 
    [
      { path: 'welcome', loadChildren: () => import('../welcome/welcome.module').then(m => m.WelcomeModule) },
      { path: 'plans', loadChildren: () => import('../plans/plans.module').then(m => m.PlansModule) },
      { path: 'incidents', loadChildren: () => import('../incidents/incidents.module').then(m => m.IncidentsModule) },
      { path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule) },
      { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
      { path: 'inventory', loadChildren: () => import('../inventory/inventory.module').then(m => m.InventoryModule) },
      { path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule) }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
