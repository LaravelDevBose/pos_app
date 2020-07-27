import { Component, OnInit } from '@angular/core';
import {listAnimation} from "../../_animation/animations";
import {ConfigService} from "../providers/config/config.service";
import {ModalController} from "@ionic/angular";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";
import {DataService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {OrderDetailModalComponent} from "../components/order-detail-modal/order-detail-modal.component";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.page.html',
    styleUrls: ['./order-list.page.scss'],
    animations: [listAnimation]
})
export class OrderListPage implements OnInit {
    public orderList: any[] =[1,1,1,1,1,1,1,1,1,1];
    public orderData: any[] =[];
    private page= 1;
    private per_page = 12;
    private last_page = 1;
    private orderSub: Subscription;
    public totalAmount = 0;
    public totalPoint = 0;
    public date: string = "";
    public reqData: string = '';
    private isLoaderActive = true;
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
        private datePipe: DatePipe,
    ) { }


    ngOnInit() {
    }

    ionViewWillEnter(){
        this.date = this.datePipe.transform(new Date(), 'dd-M-y');
        this.reqData = this.date;
        this.loader.present('Loading...');
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                if(!response){
                    if (this.isLoaderActive){
                        this.loader.dismiss();
                        this.isLoaderActive = false;
                    }
                    this.router.navigate(['/login']);
                }else {
                    this.fetchOrderList();
                }
            })

    }

    fetchOrderList(infiniteScroll?){
        let url = `sr_sale_date=${this.reqData}&page=${this.page}&per_page=${this.per_page}`;
        this.orderSub = this.dataService.fetchOrderList(this.authService.userInfo.id, url)
            .subscribe((responseData) => {
                if (this.isLoaderActive){
                    this.loader.dismiss();
                    this.isLoaderActive = false;
                }
                if (responseData.code === this.config.HTTP_OK) {

                    if (this.page === 1 && responseData.hasOwnProperty('meta')) {
                        this.last_page = responseData.meta.last_page;
                        this.orderData = responseData.data;
                        this.orderList = this.orderData;
                    } else {
                        this.orderData.push(...responseData.data);
                        this.orderList = this.orderData;
                    }
                    if (infiniteScroll) {
                        infiniteScroll.target.complete();
                    }
                    this.countTotalAmount();
                } else if (responseData.status === this.config.HTTP_NOT_FOUND) {
                    this.orderList.push([]);
                    this.alert.present('Not Found', 'No Product Found');
                    this.countTotalAmount();
                } else {
                    console.log(responseData.status);
                }
            }, (error => {
                console.log(error);
                if (this.isLoaderActive){
                    this.loader.dismiss();
                    this.isLoaderActive = false;
                }
                this.alert.present('Ops. Sorry', 'Something Wrong.');
                if (infiniteScroll) {
                    infiniteScroll.target.complete();
                }
            }))
    }

    loadData(infiniteScroll) {
        this.page++;
        if(!this.isLoaderActive){
            this.loader.present('Loading...');
            setTimeout(()=>{
                this.loader.dismiss();
                this.isLoaderActive = false;
            }, 1200)
        }
        if (this.page > this.last_page) {
            infiniteScroll.target.disabled = true;
        } else {
            this.fetchOrderList(infiniteScroll);
        }
    }

    async openOrderDetailModal(item: any) {
        const orderDetailModal = await this.modalCtrl.create({
            component: OrderDetailModalComponent,
            componentProps: {'orderDetail': item},
            animated: true,
            mode: "ios",
        })
        return await orderDetailModal.present();
    }

    countTotalAmount(){
        this.totalAmount = 0;
        this.totalPoint = 0;
        this.orderList.map((order)=>{
            this.totalAmount += +order.total_amount;
            this.totalPoint += +order.point;
        })
    }

    ngOnDestroy() {
        this.orderSub.unsubscribe();
    }

    searchDataWise() {
        if(!this.isLoaderActive){
            this.loader.present('Loading...');
            setTimeout(()=>{
                this.loader.dismiss();
                this.isLoaderActive = false;
            },1200)
        }
        this.reqData = this.datePipe.transform(this.date, 'dd-M-y');
        this.page = 1;
        this.last_page = 1;
        this.fetchOrderList();
    }
}
