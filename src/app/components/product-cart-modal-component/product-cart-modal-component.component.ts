import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ToastService} from "../../providers/toast/toast.service";
import {CartInfo, CartService} from "../../services/cart.service";


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
        size: '',
        point: 0,
        product: '',
    };
    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastService,
        private cartService: CartService,
    ) { }

    ngOnInit() {}

    ionViewWillEnter(){
        let cartProduct:CartInfo;
         this.cartService.getCartProduct(this.product.id)
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
                this.cartInfo.box_qty = +(this.product.minimum_order/ this.product.box_qty).toFixed(2);
                this.cartInfo.qty = this.product.minimum_order;
                this.cartInfo.sub_total = +(this.cartInfo.qty * this.product.shop_price).toFixed(2);
            }
            this.cartInfo.point = +((this.product.shop_price - this.product.wholesale_price)/ .5) * this.cartInfo.qty;

        }, 1500);
    }

    closeModal(){
        this.modalCtrl.dismiss();
    }
    updateBoxQty(){
        if(this.cartInfo.box_qty <= 0){
            this.productQtyValid();
        }else{
            this.productQtyUpdate(1);
        }

    }
    updateQty(){
        if(this.cartInfo.qty <= 0){
            this.productQtyValid();
        }else{
            this.productQtyUpdate(2);
        }

    }

    productQtyValid(){
        this.cartInfo.box_qty = +(this.product.minimum_order/ this.product.box_qty).toFixed(2);
        this.cartInfo.qty = this.product.minimum_order;
        this.cartInfo.sub_total = +(this.cartInfo.qty * this.product.shop_price).toFixed(2);
        this.cartInfo.point = +(((this.product.shop_price - this.product.wholesale_price)/ .5) * this.cartInfo.qty).toFixed(2);
        this.toastCtrl.presentToast('Qty Can\'t equal or less then 0', 'warning-toast');
    }
    productQtyUpdate(type){
        if(type === 1){
            this.cartInfo.qty = +(this.cartInfo.box_qty * this.product.box_qty).toFixed(0);
        }else{
            this.cartInfo.box_qty = +(this.cartInfo.qty / this.product.box_qty).toFixed(2);
        }
        this.cartInfo.sub_total = +(this.cartInfo.qty * this.product.shop_price).toFixed(2);
        this.cartInfo.point = +(((this.product.shop_price - this.product.wholesale_price)/ .5) * this.cartInfo.qty).toFixed(2);
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
        this.cartInfo.size = this.product.size;
        this.cartInfo.product = this.product;
        this.cartService.addToCart(this.cartInfo)
            .then(cartData=>{
                /*this.loader.dismiss();*/
                this.modalCtrl.dismiss();
                this.toastCtrl.presentToast('Product Add To Cart.', 'success-toast','top', 1500)
            });
    }
}
