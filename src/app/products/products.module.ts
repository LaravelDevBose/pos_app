import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import {ProductComponent} from "../components/product-component/product-component.component";
import {ProductCartModalComponent} from "../components/product-cart-modal-component/product-cart-modal-component.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProductsPageRoutingModule,
    ],
    declarations: [ProductsPage, ProductComponent, ProductCartModalComponent]
})
export class ProductsPageModule {}
