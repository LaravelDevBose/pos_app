import {Component, OnInit, ViewChild} from '@angular/core';
import {DemoDataService} from "../providers/demo-data/demo-data.service";
import {listAnimation} from "../../_animation/animations";
import {ModalController} from "@ionic/angular";
import {ProductCartModalComponent} from "../components/product-cart-modal-component/product-cart-modal-component.component";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
    animations:[listAnimation]
})
export class ProductsPage implements OnInit {
    public products: any[] =[1,1,1,1];
    private searchValue: String = "";
    private catId;
    constructor(
        public data: DemoDataService,
        private modalCtrl: ModalController,
        private loader: LoaderService,
        private alert: AlertService,
        private router: Router,
        private database: DatabaseService,
        private route: ActivatedRoute,
    ) {

    }

    ngOnInit() {
    }

    ionViewWillEnter(){

        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                if(!response){
                    this.router.navigate(['/login']);
                }
            })
        this.loader.present('Loading...');
        setTimeout(()=>{
            this.loader.dismiss();
        },1000);

        this.route.queryParams.subscribe(params => {
            if (!params.hasOwnProperty('catId')){
                this.products = this.data.products;
            }else{
                this.catId = params.catId;
                this.products = this.data.products.filter(product=> {
                    if(this.catWishProduct(product)){
                        return  product;
                    }
                })
            }
        })
    }
    searchProducts($event: any) {
        this.searchValue = $event.target.value;
        this.searchData();
    }

    searchData(isLoad?){
        if (this.searchValue == "" && !isLoad){
            this.products = this.data.products.filter(product=> {
                if(this.catWishProduct(product)){
                    return  product;
                }
            })
        }else if(isLoad){
            this.products = this.products.filter(product=> {
                if(this.catWishProduct(product)){
                    return  product;
                }
            })
        }else{
            this.products = this.products.filter(product=> {
                if (product.product_name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 && this.catWishProduct(product)){
                    return product;
                }
            });
        }

    }
    loadData(event: any) {
        setTimeout(() => {
            this.products.push(...this.data.products);
            this.searchData(1);
            event.target.complete();
            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (this.products.length == 100) {
                event.target.disabled = true;
            }
        }, 500);
    }

    cancelSearch() {
        this.searchValue="";
        this.searchData();
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

    catWishProduct(product){
        if(this.catId && this.catId > 0){
            if (product.product_category_id == this.catId){
                return  true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }
}
