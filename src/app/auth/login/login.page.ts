import { Component, OnInit } from '@angular/core';
import {LoaderService} from "../../providers/loader/loader.service";
import {DatabaseService} from "../../providers/database/database.service";
import {AlertService} from "../../providers/alert/alert.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public fieldType = 'password';
    constructor(
        private database: DatabaseService,
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router
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
                if(response){
                    this.route.navigate(['/sr/products']);
                }
            })

    }

    login(form){
        this.loader.present('Please Wait....');
        setTimeout(()=>{
            this.loader.dismiss();
            this.alert.presentWithRoute('Success', 'Login Successful', 'sr/products');
        },1500);
        this.database.setDataToStorage(this.database.access_token_table, 'sdfsdfsdfsdfsfsdfsdfsdfsdf');

    }
}
