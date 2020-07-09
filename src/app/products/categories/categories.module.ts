import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module';

import { CategoriesPage } from './categories.page';
import {MenuComponent} from "../../components/menu-component/menu-component.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoriesPageRoutingModule
    ],
    exports: [
        CategoriesPage
    ],
    declarations: [CategoriesPage, MenuComponent]
})
export class CategoriesPageModule {}
