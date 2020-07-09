import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {SelectCustomerComponent} from "../components/select-customer/select-customer.component";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";

@Component({
    selector: 'app-counter',
    templateUrl: './counter.page.html',
    styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit {
    public selectedCustomer = ""
    public cartItems: any[] = [1,1,1,1];
    public isLoading = true;
    public cartTotal = 0;
    constructor(
        private modalCtrl: ModalController,
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router,
        private database: DatabaseService,
        private alertCtrl: AlertController,
    ) { }

    ngOnInit() {
    }
    ionViewWillEnter(){
        this.loader.present('Loading...');
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                setTimeout(()=>{
                    this.loader.dismiss();
                },1000);

                if(!response){
                    this.route.navigate(['/login']);
                }
            })
        this.database.getDataFromStorage(this.database.CART_TABLE)
            .then(cartItems=> {
                setTimeout(()=>{
                    this.cartItems = cartItems;
                    this.isLoading = false;
                    this.total();
                },1200);

            })

    }
    total(){
        this.cartTotal = 0;
        for (let i=0; i< this.cartItems.length; i++){
            this.cartTotal+=  +this.cartItems[i].sub_total;
        }
    }
    async onAddCustomer(){
        const modal = await this.modalCtrl.create({
            component: SelectCustomerComponent,
            cssClass: 'select-customer-modal',
            animated: true,
            mode: "ios"
        })
        modal.onWillDismiss()
            .then(data=> {
                console.log(data['data']);
                this.selectedCustomer = data['data'];
            });


        return await modal.present();

    }

    sale(){
        this.loader.present('Please Wait..')
        this.database.setDataToStorage(this.database.CART_TABLE, []);
        setTimeout(()=>{
            this.loader.dismiss();
            this.alert.presentWithRoute('Success', 'Product sale success', '/sr/products');
        }, 1200);
    }

    async clearCart(){
        const alert = await this.alertCtrl.create({
            header: 'Clear Cart',
            message: " Are your Sure?",
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                        return alert.dismiss();
                    }
                },
                {
                    text: "Clear",
                    handler: ()=> {
                        alert.dismiss();
                        this.clearCartData();
                    }
                }
            ]
        })

        return  await alert.present();
    }

    clearCartData(){
        this.loader.present('Clearing Cart Items.')
        this.database.setDataToStorage(this.database.CART_TABLE, []);
        setTimeout(()=>{
            this.loader.dismiss();
            this.cartItems = [];
        }, 1200);
    }
}
