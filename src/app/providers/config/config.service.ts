import { Injectable } from '@angular/core';
import {DatabaseService} from "../database/database.service";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    public API_URL = 'http://paikari.pc/';
    // public API_URL = 'http://paikarimarketbd.w3codemaster.com/';
    public CLIENT_SECRET = 'WLYjq5w0BO6H36j7HjARak12kagNj9C61P2L1k3Q';
    // public CLIENT_SECRET = 'Jvx0bCD0Dw47zpoRhqAUw9xQ9tNQzpHlLY70umQM';


    //================================================//
    //================================================//
    //=============== HTTP RESPONSE ==================//

    public HTTP_OK = 200;
    public HTTP_NOT_FOUND = 404;
    public HTTP_UNAUTHORIZED = 401;
    public HTTP_NOT_ACCEPTABLE = 406;
    public HTTP_BAD_REQUEST = 400;

    public access_token = "";

    constructor(
        private database: DatabaseService,
    ) {
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(accessToken=> {
                if (accessToken){
                    this.access_token = accessToken;
                }
            })
    }

    getAccessToken(){
        this.database.getDataFromStorage(this.database.access_token_table)
            .then(accessToken=> {
                if (accessToken){
                    this.access_token = accessToken;
                }
            })
    }
}
