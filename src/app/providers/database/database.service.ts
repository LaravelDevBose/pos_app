import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    // SQL List Table Name List
    public access_token_table = 'access_token';
    public TOKEN_TABLE = '_token';
    public USER_TABLE = '_user'
    public CART_TABLE = 'carts';

    constructor(
        private storage: Storage,
    ) {

    }

    setDataToStorage(TableName, data) {
        return this.storage.set(TableName, data);
    }
    getDataFromStorage(TableName) {
        return this.storage.get(TableName);
    }

    clearDataStorage(TableName) {
        return this.storage.remove(TableName);
    }

}
