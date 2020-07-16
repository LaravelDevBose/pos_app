import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {listAnimation} from "../../../_animation/animations";

@Component({
    selector: 'app-order-detail-modal',
    templateUrl: './order-detail-modal.component.html',
    styleUrls: ['./order-detail-modal.component.scss'],
    animations: [listAnimation]
})
export class OrderDetailModalComponent implements OnInit {
    @Input('orderDetail') orderDetail:any;
    public isLoading = true;
    public orderInfo: any;
    public items = [1,1,1,1,1,1];
    constructor(
        private modalCtrl: ModalController,
    ) { }

    ngOnInit() {}

    ionViewWillEnter(){
        setTimeout(()=>{
            this.orderInfo = this.orderDetail;
            this.isLoading = false;
        },1200)
    }

    closeModal(){
        this.modalCtrl.dismiss();
    }
}
