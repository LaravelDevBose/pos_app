import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoDataService} from "../../providers/demo-data/demo-data.service";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {

    public categoryList: string[] = [];
    public expandCatId = 0;
    public categorySub: Subscription;
    constructor(
        public data: DemoDataService,
        private dataService: DataService,
    ) { }

    ngOnInit() {
        this.dataService.fetchCategoryList();
        this.categorySub = this.dataService.categoryListSubj
            .subscribe(dataList=>{
                this.categoryList = dataList;
            })
    }

    expandCategory(catId: number){
        if(this.expandCatId == catId){
            this.expandCatId = 0;
        }else{
            this.expandCatId = catId;
        }
    }
    ngOnDestroy() {
        this.categorySub.unsubscribe();
    }
}
