import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoDataService} from "../../providers/demo-data/demo-data.service";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";
import {DatabaseService} from "../../providers/database/database.service";
import {AuthService} from "../../services/auth.service";
import {ConfigService} from "../../providers/config/config.service";
import {LoaderService} from "../../providers/loader/loader.service";
import {AlertService} from "../../providers/alert/alert.service";
import {MenuController} from "@ionic/angular";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {

    public categoryList: string[] = [];
    public expandCatId = 0;
    public categorySub: Subscription;
    private logoutSub: Subscription;
    private hitLogout= false;
    constructor(
        private dataService: DataService,
        private database: DatabaseService,
        private authService: AuthService,
        private config: ConfigService,
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router,
        private storage: Storage,
        private menu: MenuController,

    ) { }

    ngOnInit() {

        setTimeout(()=>{
            this.dataService.fetchCategoryList();
        },1500);

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
        if (this.hitLogout){
            this.logoutSub.unsubscribe();
        }
    }

    selectCategory(id: any) {
        this.expandCatId = 0;
        this.route.navigate(['/sr/products'],{queryParams: {catId: id}});
    }

    logout(){
        this.menu.close('custom');
        let tokenID= "";
        this.storage.get(this.database.TOKEN_TABLE)
            .then(response=> tokenID = response);

        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                if(response){
                    this.loader.present('Please Wait...');
                    this.hitLogout = true;
                    this.logoutSub = this.authService.logout(response, tokenID)
                        .subscribe(response=>{
                            this.loader.dismiss();
                            if (this.config.HTTP_OK === response.code || response.code === this.config.HTTP_BAD_REQUEST || response.code === this.config.HTTP_UNAUTHORIZED) {
                                this.alert.presentWithRoute(response.status.toUpperCase(), response.message, '/login');
                            }else{
                                this.alert.present('Ops! Sorry.','Something wrong. Try again.');
                            }
                        })
                }else {
                    this.route.navigate(['/login']);
                }
            })
    }
}
