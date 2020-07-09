import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterPageRoutingModule } from './counter-routing.module';

import { CounterPage } from './counter.page';
import {SelectCustomerComponent} from "../components/select-customer/select-customer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CounterPageRoutingModule
  ],
  declarations: [CounterPage, SelectCustomerComponent]
})
export class CounterPageModule {}
