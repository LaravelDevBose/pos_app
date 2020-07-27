import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DemoDataService} from "../providers/demo-data/demo-data.service";
import {listAnimation} from "../../_animation/animations";
import {ModalController} from "@ionic/angular";
import {ProductCartModalComponent} from "../components/product-cart-modal-component/product-cart-modal-component.component";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";
import {DataService} from "../services/data.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {ConfigService} from "../providers/config/config.service";
import {AuthService} from "../services/auth.service";
import {CartService} from "../services/cart.service";
import {ToastService} from "../providers/toast/toast.service";

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
    animations:[listAnimation]
})
export class ProductsPage implements OnInit, OnDestroy {
    public products: any[] =[1,1,1,1];
    public productsData: any[] =[];
    private searchValue: String = "";
    private catId;
    private page= 1;
    private per_page = 12;
    private last_page = 1;
    private productSub: Subscription;
    public cartTotalAmount: BehaviorSubject<number>;
    public cartTotalPoint: BehaviorSubject<number>;
    constructor(
        public config: ConfigService,
        private modalCtrl: ModalController,
        private loader: LoaderService,
        private alert: AlertService,
        private router: Router,
        private database: DatabaseService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private authService: AuthService,
        private cartService: CartService,
        private toast: ToastService,
    ) {
        this.authService.getUserData();
        this.cartService.updateCartTotalInfo();
    }

    ngOnInit() {
        this.fetchProducts();
    }

    ionViewWillEnter(){
        this.loader.present('Loading...');
        setTimeout(()=>{
            this.loader.dismiss();
        },1000);
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                if(!response){
                    this.router.navigate(['/login']);
                }else {
                    this.route.queryParams.subscribe(params => {
                        if (!params.hasOwnProperty('catId')){
                            this.catId = 0;
                        }else{
                            this.catId = params.catId;
                        }
                        this.fetchProducts();
                    })
                }
            })

        this.cartTotalAmount = this.cartService.getCartTotalAmount();
        this.cartTotalPoint = this.cartService.getCartTotalPoint();
    }

    fetchProducts(infiniteScroll?){
        let url = `page=${this.page}&per_page=${this.per_page}`;
        this.productSub = this.dataService.fetchCategoryProduct(this.catId, url)
            .subscribe((responseData) => {
                if (responseData.code === this.config.HTTP_OK) {
                    if (this.page === 1 && responseData.hasOwnProperty('meta')) {
                        this.last_page = responseData.meta.last_page;
                        this.productsData = responseData.data;
                        this.products = this.productsData;
                    } else {
                        this.productsData.push(...responseData.data);
                        this.products = this.productsData;
                    }
                    if (infiniteScroll) {
                        infiniteScroll.target.complete();
                    }
                } else if (responseData.status === this.config.HTTP_NOT_FOUND) {
                    this.products.push([]);
                    this.alert.present('Not Found', 'No Product Found');
                } else {
                    console.log(responseData.status);
                }
            }, (error => {
                console.log(error);
                this.alert.present('Ops. Sorry', 'Something Wrong.');
                if (infiniteScroll) {
                    infiniteScroll.target.complete();
                }
            }))
    }

    searchProducts($event: any) {
        this.searchValue = $event.target.value;
        this.searchData();
    }

    searchData(isLoad?){
        if (this.searchValue == "" && !isLoad){
            this.products = this.productsData;
        }else{
            this.dataService.searchProducts(this.searchValue)
                .subscribe(({code,data}) => {
                    if(code === this.config.HTTP_OK){
                        this.products = data;
                    }else {
                        this.products.length = 0;
                    }
                }, (error)=>{
                    this.toast.presentToast('Something wrong. Try again.', 'warning-toast');
                })

        }

    }
    loadData(infiniteScroll) {
        this.page++;

        if (this.page > this.last_page) {
            infiniteScroll.target.disabled = true;
        } else {
            this.fetchProducts(infiniteScroll);
        }
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

    ngOnDestroy() {
        this.productSub.unsubscribe();
    }
}
