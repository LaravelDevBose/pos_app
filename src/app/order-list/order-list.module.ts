import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderListPageRoutingModule } from './order-list-routing.module';

import { OrderListPage } from './order-list.page';
import {OrderDetailModalComponent} from "../components/order-detail-modal/order-detail-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderListPageRoutingModule
  ],
  providers:[DatePipe],
  declarations: [OrderListPage, OrderDetailModalComponent]
})
export class OrderListPageModule {}
