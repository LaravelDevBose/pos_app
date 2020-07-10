import {Component, OnDestroy} from '@angular/core';
import {DatabaseService} from "../providers/database/database.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {ConfigService} from "../providers/config/config.service";
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnDestroy{
    private logoutSub: Subscription;
    private hitLogout= false;
    constructor(
        private database: DatabaseService,
        private authService: AuthService,
        private config: ConfigService,
        private loader: LoaderService,
        private alert: AlertService,
        private router: Router,
        private storage: Storage,
    ) {}

    logout(){

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
                    this.router.navigate(['/login']);
                }
            })
    }

    ngOnDestroy() {
        if (this.hitLogout){
            this.logoutSub.unsubscribe();
        }
    }
}
