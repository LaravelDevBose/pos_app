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
import {CartDetails, CartService} from "../services/cart.service";

@Component({
    selector: 'app-counter',
    templateUrl: './counter.page.html',
    styleUrls: ['./counter.page.scss'],
})
export class CounterPage implements OnInit, OnDestroy {
    public selectedCustomer:any = ""
    public cartItems: any[] = [1,1,1,1];
    public cartDetail: any;
    public isLoading = true;
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
        private cartService: CartService,
    ) {
        this.cartService.updateCartTotalInfo();
    }

    ngOnInit() {
        this.authService.getUserData();
        this.cartService.cartDetail.subscribe(cartDetail=>{
            this.cartDetail = cartDetail;
            this.cartItems = this.cartDetail.cartItems;
        });
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
        setTimeout(()=>{
            this.isLoading = false;
        },1200);
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
            'total': this.cartDetail.total_amount,
            'qty': this.cartDetail.total_qty,
            'point': this.cartDetail.total_point,
            'sr_id': this.authService.userInfo.id,
        }
        this.saleSub = this.dataService.storeSale(reqData)
            .subscribe(({status, code, message})=> {
                this.loader.dismiss();
                if (code == this.config.HTTP_OK){
                    this.cartService.clearCartData()
                        .then((response)=>{
                            this.cartItems.length = 0;
                            this.selectedCustomer = '';
                            this.cartDetail = "";
                        });
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
        this.cartService.clearCartData()
            .then((response)=>{
                this.loader.dismiss();
                this.cartItems.length = 0;
                this.selectedCustomer = '';
            });
    }

    async openModal(product: any){
        const productModal = await this.modalCtrl.create({
            component: ProductCartModalComponent,
            cssClass: 'product-cart',
            componentProps: {'product': product},
            animated: true,
            mode: "ios",
        })
        return await productModal.present();
    }

    ngOnDestroy() {
        if (this.hitSale){
            this.saleSub.unsubscribe();
        }
    }
}
