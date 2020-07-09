import { Injectable } from '@angular/core';
import {CartInfo, DemoDataService} from "../demo-data/demo-data.service";
import {AlertService} from "../alert/alert.service";
import {Storage} from '@ionic/storage';
@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    // SQL List Table Name List
    public access_token_table = 'access_token';
    public CART_TABLE = 'carts';

    constructor(
        private storage: Storage,
        private demoDataService: DemoDataService,
        private alert: AlertService,
    ) {
        this.getDataFromStorage(this.CART_TABLE)
            .then(cartItems=> {
                if(cartItems){
                    this.demoDataService.cartTotal.next(cartItems.length);
                }else{
                    this.demoDataService.cartTotal.next(0);
                }

            })
    }

    setDataToStorage(TableName, data) {
        return this.storage.set(TableName, data);
    }
    getDataFromStorage(TableName) {
        return this.storage.get(TableName);
    }

    clearDataStorage(TableName) {
        return this.storage.remove(TableName);
    }

    addToCart(cart: CartInfo): Promise<CartInfo[]> {
        return this.storage.get(this.CART_TABLE)
            .then((cartItems) => {
                if (cartItems) {
                    let added = false;
                    for (const p of cartItems) {
                        if (p.product_id === cart.product_id) {
                            p.qty = cart.qty;
                            p.box_qty = cart.box_qty;
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        cartItems.push(cart);
                        this.demoDataService.cartTotal.next(this.demoDataService.cartTotal.value + 1);
                    }
                    return this.setDataToStorage(this.CART_TABLE, cartItems);
                } else {
                    this.demoDataService.cartTotal.next(this.demoDataService.cartTotal.value + 1);
                    return this.setDataToStorage(this.CART_TABLE, [cart]);
                }
            });
    }

    getCartProduct(productId: number){
        let cartProduct:CartInfo;
        return this.getDataFromStorage(this.CART_TABLE)
            .then(cartItems => {
                if(cartItems){
                    cartItems.filter(cart => {
                        if (cart.product_id == productId){
                            cartProduct = cart;
                        }
                    })
                }
                return cartProduct;
            });

    }

    removeCartProduct(proId: number): Promise<CartInfo[]> {
        return this.storage.get(this.CART_TABLE)
            .then((cartItems) => {
                if (cartItems) {
                    cartItems = cartItems.filter(cart => +cart.product_id !== proId);
                    this.demoDataService.cartTotal.next(this.demoDataService.cartTotal.value - 1);
                    return this.setDataToStorage(this.CART_TABLE, cartItems);
                } else {
                    this.alert.present('Warning', 'No Cart Product Found.');
                }
            });
    }

    clearCartData(): Promise<CartInfo[]> {
        this.demoDataService.cartTotal.next(0);
        return this.setDataToStorage(this.CART_TABLE, []);
    }
}
