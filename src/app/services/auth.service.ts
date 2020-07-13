import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {ConfigService} from "../providers/config/config.service";
import {DatabaseService} from "../providers/database/database.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public authUserBehavior = new BehaviorSubject<number>(0);
    public userInfo:any="";
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private database: DatabaseService
    ) {
        this.database.getDataFromStorage(this.database.USER_TABLE)
            .then(userInfo=> {
                if (userInfo){
                    this.userInfo = userInfo;
                }
            })
    }

    getUserData(){
        this.database.getDataFromStorage(this.database.USER_TABLE)
            .then(userInfo=> {
                if (userInfo){
                    this.userInfo = userInfo;
                }
            })
    }
    login(formData: { username: string, password: string }) {
        const credentials = {
            grant_type: 'password',
            client_id: 2,
            client_secret: this.config.CLIENT_SECRET,
            username: formData.username,
            password: formData.password,
        };

        return this.http.post<any>(this.config.API_URL + 'api/oauth/login', credentials)
            .pipe(tap(response => {
                if (response.code == this.config.HTTP_OK && response.data.hasOwnProperty('access_token')) {
                    const accessToken = response.data.token_type + ' ' + response.data.access_token;
                    this.config.access_token = accessToken;
                    this.database.setDataToStorage(this.database.access_token_table, accessToken);
                    this.database.setDataToStorage(this.database.TOKEN_TABLE, response.data.token_id);
                    this.database.setDataToStorage(this.database.USER_TABLE, response.data.user);
                    this.userInfo = response.data.user;
                    this.authUserBehavior.next(1);
                }
            }));
    }

    logout(access_token: string, tokenId: string) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: access_token,
        });
        return this.http.post<any>(this.config.API_URL + 'api/oauth/logout', {token_id: tokenId},{headers})
            .pipe(tap(response => {
                if (this.config.HTTP_OK === response.code || response.code === this.config.HTTP_BAD_REQUEST || response.code === this.config.HTTP_UNAUTHORIZED) {
                    this.database.setDataToStorage(this.database.USER_TABLE, "");
                    this.database.setDataToStorage(this.database.CART_TABLE, []);
                    this.database.setDataToStorage(this.database.TOKEN_TABLE, "");
                    this.database.setDataToStorage(this.database.access_token_table, "");
                    this.userInfo = "";
                    this.config.access_token = "";
                    this.authUserBehavior.next(0);
                }
            }));

    }
    fetchUserInformation() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('access_token')
        });
        this.http.get<any>(this.config.API_URL + 'user', {headers})
            .subscribe(
                (response => {
                    if (response.status === this.config.HTTP_OK) {
                        this.userInfo = response.data;
                    }
                })
            );
    }
    isAuthenticated() {
        const access_token = this.database.getDataFromStorage(this.database.access_token_table);
        const promise = new Promise(
            (resolve, reject) => {
                if (typeof access_token !== 'undefined' && access_token !== null) {
                    resolve(true);
                } else if (typeof access_token !== 'undefined' && access_token !== null) {
                    resolve(true);
                } else {
                    localStorage.removeItem('access_token');
                    resolve( false);
                }
            }
        );
        return promise;
    }
}
