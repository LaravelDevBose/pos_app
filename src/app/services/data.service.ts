import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "../providers/config/config.service";
import {Subject} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private categoryList: string[];
    private productList: string[]=[];
    public categoryListSubj: Subject<string[]> = new Subject<string[]>();
    constructor(
        private http: HttpClient,
        private config: ConfigService,
    ) {
        this.config.getAccessToken();
    }

    fetchCategoryList() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: this.config.access_token,
        });
        this.http.get<any>(this.config.API_URL + 'api/category-list', {headers})
            .subscribe(response=>{
                if (response.code === this.config.HTTP_OK){
                    this.categoryList = response.data;
                    this.categoryListSubj.next(this.categoryList);
                }
            })
    }

    fetchCategoryProduct(catId=0, url:string=""){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: this.config.access_token,
        });
        return this.http.get<any>(this.config.API_URL + `api/category/${catId}/products?${url}`, {headers})
            .pipe(tap(response=>{
                if(response.code === this.config.HTTP_OK){
                    this.productList.push(...response.data);
                }
            }));
    }
    fetchCustomerList(){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: this.config.access_token,
        });
        return this.http.get<any>(this.config.API_URL + `api/customer-list`, {headers});
    }

    storeSale(data){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: this.config.access_token,
        });
        return this.http.post<any>(this.config.API_URL+`api/sale-store`, data, {headers});
    }
}
