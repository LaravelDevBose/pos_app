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
    public userInfo = [];
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private database: DatabaseService
    ) {

    }

    login(formData: { email: string, password: string }) {
        const credentials = {
            grant_type: 'password',
            client_id: 2,
            client_secret: this.config.CLIENT_SECRET,
            username: formData.email,
            password: formData.password,
        };

        return this.http.post<any>(this.config.APP_URL + 'oauth/token', credentials)
            .pipe(tap(response => {
                if (response.hasOwnProperty('access_token')) {
                    const accessToken = response.token_type + ' ' + response.access_token;
                    this.database.setDataToStorage(this.database.access_token_table, accessToken);
                    this.authUserBehavior.next(1);
                }
            }));
    }

    logout() {
        let access_token = "";
            this.database.getDataFromStorage(this.database.access_token_table)
                .then(accessToken => {
                    access_token = accessToken;
                });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: access_token,
        });
        return this.http.get<any>(this.config.APP_URL + 'logout', {headers})
            .pipe(tap(response => {
                if (this.config.HTTP_OK === response.status) {
                    this.database.setDataToStorage(this.database, "");
                    this.authUserBehavior.next(0);
                } else if (response.status === this.config.HTTP_UNAUTHORIZED) {
                    this.database.clearDataStorage(this.database.access_token_table);
                    this.authUserBehavior.next(0);
                }
            }));

    }
    fetchUserInformation() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('access_token')
        });
        this.http.get<any>(this.config.APP_URL + 'user', {headers})
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
