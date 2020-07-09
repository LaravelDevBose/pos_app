import {Component, Input, OnInit} from '@angular/core';
import {fadein, fadeout} from "../../../_animation/animations";

@Component({
    selector: 'app-product-component',
    templateUrl: './product-component.component.html',
    styleUrls: ['./product-component.component.scss'],
    animations:[fadein, fadeout]
})
export class ProductComponent implements OnInit {

    @Input('product') product: any;
    public isLoading = true;
    constructor() { }

    ngOnInit() {}

    ionViewWillEnter(){
        setTimeout(()=>{
            this.isLoading = false;
        },1200)
    }
}
