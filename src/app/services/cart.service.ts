import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {DatabaseService} from "../providers/database/database.service";
import {AlertService} from "../providers/alert/alert.service";

export interface CartInfo {
    product_id: number;
    product_name: string;
    price: number;
    box_qty: number;
    qty: number;
    sub_total: number;
    size: string;
    point: number;
    product: any;
}
export interface CartDetails {
    cartItems: CartInfo[];
    total_amount: number;
    total_point: number;
    total_qty: number;
}
@Injectable({
    providedIn: 'root'
})
export class CartService {
    public cartTotalQty = new BehaviorSubject(0);
    public cartTotalAmount = new BehaviorSubject(0);
    public cartTotalPoint = new BehaviorSubject(0);
    public cartDetail: Subject<CartDetails> = new Subject<CartDetails>();
    constructor(
        private database: DatabaseService,
        private alert: AlertService,
    ) {
        this.updateCartTotalInfo();
    }

    addToCart(cart: CartInfo): Promise<CartInfo[]> {
        return this.database.getDataFromStorage(this.database.CART_TABLE)
            .then((cartDetails: CartDetails) => {
                if (cartDetails && cartDetails.cartItems) {
                    let added = false;
                    for (const p of cartDetails.cartItems) {
                        if (p.product_id === cart.product_id) {
                            p.qty = cart.qty;
                            p.box_qty = cart.box_qty;
                            p.sub_total = cart.sub_total;
                            p.point = cart.point;
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        cartDetails.cartItems.push(cart);
                    }
                    return this.database.setDataToStorage(this.database.CART_TABLE, cartDetails);
                } else {
                    const cartDetail = {
                        cartItems: [cart],
                        total_amount: this.cartTotalAmount.value,
                        total_point: this.cartTotalPoint.value,
                        total_qty: this.cartTotalQty.value,
                    }
                    return this.database.setDataToStorage(this.database.CART_TABLE, cartDetail);
                }
            }).finally(()=>{
                console.log('cart update...');
                this.updateCartTotalInfo();
                return true;

            });
    }

    getCartProduct(productId: number){
        let cartProduct:CartInfo;
        return this.database.getDataFromStorage(this.database.CART_TABLE)
            .then(cartDetail => {
                if(cartDetail && cartDetail.cartItems){
                    cartDetail.cartItems.filter(cart => {

                        if (cart.product_id == productId){

                            cartProduct = cart;
                        }
                    })
                }
                return cartProduct;
            });

    }

    removeCartProduct(proId: number): Promise<CartInfo[]> {
        return this.database.getDataFromStorage(this.database.CART_TABLE)
            .then((cartItems) => {
                if (cartItems) {
                    cartItems = cartItems.filter(cart => +cart.product_id !== proId);
                    return this.database.setDataToStorage(this.database.CART_TABLE, cartItems);
                } else {
                    this.alert.present('Warning', 'No Cart Product Found.');
                }
            }).finally(()=> {
                this.updateCartTotalInfo();
                return true;
            });
    }

    clearCartData(): Promise<CartDetails> {

        return this.database.setDataToStorage(this.database.CART_TABLE, "")
            .finally(()=>{
                this.updateCartTotalInfo();
                return true;
            });
    }

    updateCartTotalInfo(){
        let totalAmount = 0;
        let totalPoint = 0;
        let totalQty = 0;
        this.database.getDataFromStorage(this.database.CART_TABLE)
            .then(cartDetail => {
                if(cartDetail && cartDetail.cartItems){
                    for (let item of cartDetail.cartItems){
                        totalAmount += item.sub_total;
                        totalPoint += item.point;
                        totalQty += totalQty;
                    }
                    cartDetail.total_amount = totalAmount;
                    cartDetail.total_point = totalPoint;
                    cartDetail.total_qty = totalQty;
                    this.database.setDataToStorage(this.database.CART_TABLE, cartDetail);
                    this.cartDetail.next(cartDetail);
                }
            }).finally(()=>{
                this.cartTotalQty.next(totalQty);
                this.cartTotalAmount.next(totalAmount);
                this.cartTotalPoint.next(totalPoint);
                return true;
        });
    }

    getCartTotalAmount() {
        return this.cartTotalAmount;
    }
    getCartTotalPoint() {
        return this.cartTotalPoint;
    }
    getCartTotalQty() {
        return this.cartTotalQty;
    }
}
