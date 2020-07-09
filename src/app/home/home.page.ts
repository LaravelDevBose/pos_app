import { Component, OnInit } from '@angular/core';
import {LoaderService} from "../providers/loader/loader.service";
import {AlertService} from "../providers/alert/alert.service";
import {Router} from "@angular/router";
import {DatabaseService} from "../providers/database/database.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router,
        private database: DatabaseService,
    ) { }

    ngOnInit() {
    }
    ionViewWillEnter(){
        this.loader.present('Loading...');
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                setTimeout(()=>{
                    this.loader.dismiss();
                },1000);

                if(!response){
                    this.route.navigate(['/login']);
                }
            })

    }
}
