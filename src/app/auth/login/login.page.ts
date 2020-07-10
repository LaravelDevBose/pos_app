import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from "../../providers/loader/loader.service";
import {DatabaseService} from "../../providers/database/database.service";
import {AlertService} from "../../providers/alert/alert.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {ConfigService} from "../../providers/config/config.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

    public fieldType = 'password';
    public loginSub:Subscription;
    constructor(
        private database: DatabaseService,
        private loader: LoaderService,
        private alert: AlertService,
        private route: Router,
        private authService: AuthService,
        private config: ConfigService,
    ) { }

    ngOnInit() {

    }

    ionViewWillEnter(){
        this.loader.present('Loading...');
        setTimeout(()=>{
            this.loader.dismiss();
        },1200);
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(response=>{
                if(response){
                    this.route.navigate(['/sr/products']);
                }
            })

    }

    login(form){
        this.loader.present('Please Wait....');
        const formData = {
            'username': form.value.username,
            'password': form.value.password,
        }
        this.loginSub = this.authService.login(formData)
            .subscribe(response=>{
                this.loader.dismiss();
                if(response.code === this.config.HTTP_OK){
                    this.alert.presentWithRoute('Success', 'Login Successful', 'sr/products');
                }else if(response.code === this.config.HTTP_NOT_ACCEPTABLE || response.code === this.config.HTTP_BAD_REQUEST){
                    this.alert.present(response.status.toUpperCase(), response.message);
                }else{
                    this.alert.present('Error', 'Something Wrong. Try again.');
                }
            })

    }
    ngOnDestroy() {
        this.loginSub.unsubscribe();
    }
}
