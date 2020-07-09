import { Component, OnInit } from '@angular/core';
import {DemoDataService} from "../../providers/demo-data/demo-data.service";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

    public expandCatId = 0;
    constructor(
        public data: DemoDataService,
    ) { }

    ngOnInit() {
    }

    expandCategory(catId: number){
        if(this.expandCatId == catId){
            this.expandCatId = 0;
        }else{
            this.expandCatId = catId;
        }
    }
}
