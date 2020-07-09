import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'sr',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
            },
            {
                path: 'products',
                loadChildren: () => import('../products/products.module').then( m => m.ProductsPageModule)
            },
            {
                path: 'counter',
                loadChildren: () => import('../counter/counter.module').then( m => m.CounterPageModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
            },
            {
                path: '',
                redirectTo: 'sr/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'sr/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {}
