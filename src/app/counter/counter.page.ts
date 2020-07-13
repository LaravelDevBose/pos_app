import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {SelectCustomerComponent} from "../components/select-customer/select-customer.component";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";
import {Subscription} from "rxjs";
import {DataService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {ConfigService} from "../providers/config/config.service";
import {ProductCartModalComponent} from "../components/product-cart-modal-component/product-cart-modal-component.component";

@Component({
    selector: 'app-counter',
    templateUrl: './counter.page.html',
    styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit, OnDestroy {
    public selectedCustomer:any = ""
    public cartItems: any[] = [1,1,1,1];
    public isLoading = true;
    public cartTotal = 0;
    public cartQty = 0;
    private saleSub: Subscription;
    private hitSale = false;
    constructor(
        private modalCtrl: ModalController,
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router,
        private database: DatabaseService,
        private alertCtrl: AlertController,
        private dataService: DataService,
        private authService: AuthService,
        private config: ConfigService,
    ) { }

    ngOnInit() {
        this.authService.getUserData();
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
            this.cartQty += +this.cartItems[i].qty;
        }
    }
    async onSelectCustomer(){
        const modal = await this.modalCtrl.create({
            component: SelectCustomerComponent,
            componentProps: {"selectedCustomer": this.selectedCustomer},
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
        this.hitSale = true;
        this.loader.present('Please Wait..');
        const reqData = {
            'customer_id': this.selectedCustomer.id,
            'carts': this.cartItems,
            'total': this.cartTotal,
            'qty': this.cartQty,
            'sr_id': this.authService.userInfo.id,
        }
        this.saleSub = this.dataService.storeSale(reqData)
            .subscribe(({status, code, message})=> {
                this.loader.dismiss();
                if (code == this.config.HTTP_OK){
                    this.database.setDataToStorage(this.database.CART_TABLE, []);
                    this.alert.presentWithRoute(status, message, '/sr/products');
                }else if(code === this.config.HTTP_BAD_REQUEST || code === this.config.HTTP_NOT_ACCEPTABLE){
                    this.alert.present(status, message);
                }else{
                    this.alert.present('Ops! Sorry', 'Something wrong. Try again.');
                }
            }, (error)=>{
                console.log(error);
                this.alert.present('Ops! Sorry', 'Something wrong. Try again.');
            })
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

    ngOnDestroy() {
        if (this.hitSale){
            this.saleSub.unsubscribe();
        }
    }
}
