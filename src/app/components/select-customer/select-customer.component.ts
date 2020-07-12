import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {DatabaseService} from "../../providers/database/database.service";
import {DemoDataService} from "../../providers/demo-data/demo-data.service";
import {listAnimation} from "../../../_animation/animations";
import {ToastService} from "../../providers/toast/toast.service";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {ConfigService} from "../../providers/config/config.service";

@Component({
    selector: 'app-select-customer',
    templateUrl: './select-customer.component.html',
    styleUrls: ['./select-customer.component.scss'],
    animations:[listAnimation]
})
export class SelectCustomerComponent implements OnInit {
    @Input('selectedCustomer') selectedCustomer: any;
    public isLoading = true;
    public selectCus: any;
    public customers: any[] = [1,1,1,1,1];
    private customerData: any[];
    public searchValue = "";
    private customerSub: Subscription;
    constructor(
        private modalCtrl: ModalController,
        public dataService: DataService,
        private toast: ToastService,
        private config: ConfigService
    ) { }

    ngOnInit() {}

    ionViewWillEnter(){
        this.selectCus = this.selectedCustomer;
        this.customerSub = this.dataService.fetchCustomerList()
            .subscribe(({code, data})=>{
                this.isLoading = false;
                if(code === this.config.HTTP_OK){
                    this.customerData = data;
                    this.customers = this.customerData;
                }else{
                    this.toast.presentToast('No Customers Found', 'warning-toast');
                }
            }, (error)=>{
                console.log(error);
                this.toast.presentToast('No Customers Found', 'warning-toast');
            })
    }

    closeModal() {
        this.modalCtrl.dismiss(this.selectCus);
    }

    searchProducts($event: any) {
        this.searchValue = $event.target.value;
        this.searchData();
    }

    searchData(){
        this.customers = this.customerData.filter(customer=> {
            if (customer.username.toString().indexOf(this.searchValue.toLowerCase()) > -1 || customer.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1){
                return  customer;
            }
        });
    }

    cancelSearch() {
        this.customers = this.customerData;
        this.searchValue="";
    }
    selectCustomer(customer){
        this.selectCus = customer;
        this.modalCtrl.dismiss(this.selectCus);
        this.toast.presentToast('Customer Selected', 'success-toast');
    }
}
