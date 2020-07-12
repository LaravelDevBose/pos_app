import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ToastService} from "../../providers/toast/toast.service";
import {CartInfo} from "../../providers/demo-data/demo-data.service";
import {DatabaseService} from "../../providers/database/database.service";
import {LoaderService} from "../../providers/loader/loader.service";


@Component({
    selector: 'app-product-cart-modal-component',
    templateUrl: './product-cart-modal-component.component.html',
    styleUrls: ['./product-cart-modal-component.component.scss'],
})
export class ProductCartModalComponent implements OnInit {
    @Input('product') product: any;
    public isLoading = true;
    public cartInfo: CartInfo = {
        product_id: 0,
        product_name: "",
        price: 100.00,
        box_qty: 0,
        qty: 0,
        sub_total: 0,
    };
    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastService,
        private database: DatabaseService,
    ) { }

    ngOnInit() {}

    ionViewWillEnter(){
        let cartProduct:CartInfo;
         this.database.getCartProduct(this.product.product_id)
             .then(cartProductInfo=>{
                 cartProduct = cartProductInfo;
             })

        setTimeout(()=> {
            this.isLoading = false;
            if (cartProduct){
                this.cartInfo.box_qty = cartProduct.box_qty;
                this.cartInfo.qty = cartProduct.qty
                this.cartInfo.sub_total = cartProduct.sub_total;
            }else{
                this.cartInfo.box_qty = (this.product.minimum_order/ this.product.box_qty);
                this.cartInfo.qty = this.product.minimum_order;
                this.cartInfo.sub_total = (this.cartInfo.qty * this.product.shop_price);
            }


        }, 1500);
    }

    closeModal(){
        this.modalCtrl.dismiss();
    }
    updateBoxQty(){
        if(this.cartInfo.box_qty <= 0){
            this.cartInfo.box_qty = (this.product.minimum_order/ this.product.box_qty);
            this.cartInfo.qty = this.product.minimum_order;
            this.cartInfo.sub_total = (this.cartInfo.qty * this.product.shop_price);
            this.toastCtrl.presentToast('Qty Can\'t equal or less then 0', 'warning-toast');
        }else{
            this.cartInfo.qty = this.cartInfo.box_qty * this.product.box_qty;
            this.cartInfo.sub_total = (this.cartInfo.qty * this.product.shop_price);
        }

    }
    updateQty(){
        if(this.cartInfo.qty <= 0){
            this.cartInfo.box_qty = (this.product.minimum_order/ this.product.box_qty);
            this.cartInfo.qty = this.product.minimum_order;
            this.cartInfo.sub_total = (this.cartInfo.qty * this.product.shop_price);
            this.toastCtrl.presentToast('Qty Can\'t equal or less then 0', 'warning-toast');
        }else{
            this.cartInfo.box_qty = this.cartInfo.qty / this.product.box_qty;
            this.cartInfo.sub_total = (this.cartInfo.qty * this.product.shop_price);
        }

    }

    decreaseBoxQty() {
        this.cartInfo.box_qty = this.cartInfo.box_qty - 1;
    }

    incrementBoxQty() {
        this.cartInfo.box_qty = this.cartInfo.box_qty + 1;
    }

    decreaseQty() {
        this.cartInfo.qty --;
    }

    incrementQty() {
        this.cartInfo.qty ++;
    }

    productAddToCart() {
        /*this.loader.present('Please Wait...');*/
        this.cartInfo.product_id = this.product.id;
        this.cartInfo.product_name = this.product.name;
        this.cartInfo.price = this.product.shop_price;
        this.cartInfo.sub_total = this.product.shop_price * this.cartInfo.qty;

        this.database.addToCart(this.cartInfo)
            .then(cartData=>{
                /*this.loader.dismiss();*/
                this.modalCtrl.dismiss();
                this.toastCtrl.presentToast('Product Add To Cart.', 'success-toast', 1500)
            });
    }
}
