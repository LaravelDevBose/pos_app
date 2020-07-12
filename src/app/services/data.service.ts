import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "../providers/config/config.service";
import {DatabaseService} from "../providers/database/database.service";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private categoryList: string[];
    private productList: string[];
    public categoryListSubj: Subject<string[]> = new Subject<string[]>();
    public productListSubj: Subject<string[]> = new Subject<string[]>();
    public userInfo = [];
    constructor(
        private http: HttpClient,
        private config: ConfigService,
        private database: DatabaseService
    ) {

    }

    fetchCategoryList() {
        this.http.get<any>(this.config.API_URL + 'api/category-list')
            .subscribe(response=>{
                if (response.code === this.config.HTTP_OK){
                    this.categoryList = response.data;
                    this.categoryListSubj.next(this.categoryList);
                }
            })
    }

    fetchCategoryProduct(catId=0, url:string=""){
        return this.http.get<any>(this.config.API_URL + `api/category/${catId}/products?${url}`);
    }

    fetchCustomerList(){
        return this.http.get<any>(this.config.API_URL + `api/customer-list`);
    }
}
