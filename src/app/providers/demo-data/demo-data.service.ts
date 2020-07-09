import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DatabaseService} from "../database/database.service";
export interface CartInfo {
    product_id: number;
    product_name: string;
    price: number;
    box_qty: number;
    qty: number;
    sub_total: number;
}

@Injectable({
    providedIn: 'root'
})
export class DemoDataService {

    public cartTotal = new BehaviorSubject(0);
    constructor() {

    }

    public categoryList = [
        {"category_id":"1","parent_id":"0","category_name":"Stationary","category_status":"1",
            "children":[{"category_id":"10","parent_id":"1","category_name":"Food & Beverage","category_status":"1",},
            ]
        },
        {"category_id":"2","parent_id":"0","category_name":"Electric & Electronics","category_status":"1",},
        {"category_id":"3","parent_id":"0","category_name":"Clothing","category_status":"1",},
        {"category_id":"4","parent_id":"0","category_name":"Hardware","category_status":"1",},
        {"category_id":"5","parent_id":"0","category_name":"Sports","category_status":"1",},
        {"category_id":"6","parent_id":"0","category_name":"Herbal","category_status":"1",},
        {"category_id":"7","parent_id":"0","category_name":"Cosmatics","category_status":"1",},
        {"category_id":"8","parent_id":"0","category_name":"Mobile Accessories","category_status":"1",},
        {"category_id":"9","parent_id":"0","category_name":"Garment Accessories","category_status":"1",},
        {"category_id":"11","parent_id":"0","category_name":"Medicin","category_status":"1",},
        {"category_id":"12","parent_id":"0","category_name":"Others","category_status":"1",}
    ];

    public products = [
        {"product_id":"1","shop_id":"0","product_category_id":"10","product_category_main_id":"1","product_name":"Fresh","product_image":"26","minimum_order":"4","stock_balance":"36","total_sales":"0","description":"Good","terms_and_conditions":"No","product_variation":"No","product_weight":"5","home_status":"1","ordering":"2020-06-02","product_status":"1","created_at":"2020-05-31 19:24:16","updated_at":"2020-06-25 10:25:37","brand_id":"1","box_qty":"4","shop_price":"470.00","buy_price":"50.00","wholesale_price":"450.00","mrp_price":"500.00","unit_id":"1","product_size":"0.00"},
        {"product_id":"2","shop_id":"0","product_category_id":"10","product_category_main_id":"1","product_name":"Fresh oil 2ltr","product_image":"27","minimum_order":"9","stock_balance":"0","total_sales":"0","description":"Ok","terms_and_conditions":"Ok","product_variation":"No","product_weight":"2","home_status":"1","ordering":"2020-06-01","product_status":"1","created_at":"2020-05-31 19:52:32","updated_at":"2020-06-25 08:23:37","brand_id":"1","box_qty":"9","shop_price":"201.00","buy_price":"200.00","wholesale_price":"193.00","mrp_price":"218.00","unit_id":"1","product_size":"0.00"},
        {"product_id":"3","shop_id":"0","product_category_id":"10","product_category_main_id":"1","product_name":"Arup New Product","product_image":"28","minimum_order":"5","stock_balance":"11","total_sales":"0","description":"dasdsad","terms_and_conditions":"asdasdad","product_variation":"na","product_weight":"1","home_status":"1","ordering":"2020-06-03","product_status":"1","created_at":"2020-06-03 12:13:49","updated_at":"2020-06-22 06:46:57","brand_id":"1","box_qty":"4","shop_price":"1570.00","buy_price":"1500.00","wholesale_price":"1550.00","mrp_price":"1580.00","unit_id":"1","product_size":"0"},
        {"product_id":"6","shop_id":"0","product_category_id":"10","product_category_main_id":"1","product_name":"sdfsadf","product_image":null,"minimum_order":"0","stock_balance":"0","total_sales":"0","description":"sdfsdf","terms_and_conditions":"sdfsdf","product_variation":"fdsadf","product_weight":"0","home_status":"1","ordering":"2020-06-16","product_status":"1","created_at":"2020-06-15 10:03:24","updated_at":"2020-06-15 10:03:24","brand_id":null,"box_qty":"0","shop_price":"15.00","buy_price":"10.15","wholesale_price":"10.00","mrp_price":"20.00","unit_id":"1","product_size":"sdfdf"},
        {"product_id":"7","shop_id":"0","product_category_id":"10","product_category_main_id":"1","product_name":"fsadfsfsf","product_image":null,"minimum_order":"2","stock_balance":"0","total_sales":"0","description":null,"terms_and_conditions":null,"product_variation":null,"product_weight":"0","home_status":null,"ordering":null,"product_status":"0","created_at":"2020-06-16 10:41:57","updated_at":"2020-06-16 10:41:57","brand_id":null,"box_qty":"6","shop_price":"15.00","buy_price":"1.00","wholesale_price":"10.00","mrp_price":"20.00","unit_id":"1","product_size":"sdfsdfsdf"}
    ];

    public customers = [
        {"id":"1","shop_id":"0","name":"Admin","username":"01234567890","email":"admin@admin.com","phone":null,"password":"$2y$10$Zy2LzuvPg5l.vQ6axdJv8e7qtDnconfSgrBZlBGpjabOoSZUtDgly","avatar_id":null,"role":"1","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-22 15:19:31","updated_at":"2020-05-22 15:19:31","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"2","shop_id":"0","name":"New Vendor","username":"01731909035","email":"new@vendor.com","phone":"123456","password":"$2y$10$qT2WF4.OGk4xyELvrtqgJOzDbvYO\/afLwWZO5B4gdhNyApI7zk\/x.","avatar_id":null,"role":"4","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-27 11:06:59","updated_at":"2020-06-11 10:03:09","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"8400.00","user_address":"sherour","licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"3","shop_id":"1","name":"New Depo","username":"12345678999","email":"depo@gm.com","phone":"123456","password":"$2y$10$DGIa5qby1yf3.BhTwlU2tOjkULYkOPCmMuvssvW7DVBgtftTL15AG","avatar_id":null,"role":"7","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-27 11:44:47","updated_at":"2020-06-25 10:25:37","otp_code":null,"nid_image":"12","licence_image":"13","user_balance":"-942.00","user_address":"Shamoliy, Dhaka","licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"4","shop_id":"2","name":"new Shop","username":"11223344556","email":"shop@gm.com","phone":"1223354414","password":"$2y$10$8fL7yvJ3X7bYoaSkapopSuRZZkvTVgma22Bq\/m8csZ88Asy7niN\/K","avatar_id":null,"role":"3","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-27 11:46:34","updated_at":"2020-06-22 06:46:57","otp_code":null,"nid_image":"14","licence_image":"15","user_balance":"-8160.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"5","shop_id":"3","name":"New Supplier","username":"supplier","email":"supplier@gm.com","phone":"1234656575","password":"$2y$10$9mASXfb8vZMOPA7LADM6WOg2xFcHW1rBe9ZxGwhUvb90\/VmXpACyK","avatar_id":null,"role":"8","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-27 11:47:57","updated_at":"2020-05-27 11:57:10","otp_code":null,"nid_image":"16","licence_image":"17","user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"6","shop_id":"0","name":"Store Manager 01","username":"12345678900","email":"store01@test.com","phone":"123456798","password":"$2y$10$HNbnI8MN.ajwdqbjThSysuy4p2CAVLzeGbLqJA6YaEHPjuQmRYGrq","avatar_id":null,"role":"9","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-30 19:18:18","updated_at":"2020-06-05 15:54:16","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"7","shop_id":"0","name":"Test","username":"Test01","email":"lutfurrahmanrubel@gmail.com","phone":"01848304555","password":"$2y$10$Qxf.RGQtUGqXJX.cNtSY7ODTBkWtMspf0Cuc9ycTzzR.XgGsWGx6S","avatar_id":null,"role":"9","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-31 19:20:53","updated_at":"2020-05-31 19:20:53","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"8","shop_id":"0","name":"Tast02","username":"01848304555","email":"lutfurrahmanrubel@gmail.com","phone":"01848304555","password":"$2y$10$0CHkbkIZcSeBUNKOZPhWBe0VtPt4Qh\/A71YU0uJ1V\/zyQWZkXKqpy","avatar_id":null,"role":"4","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-05-31 19:21:43","updated_at":"2020-06-11 10:18:34","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":"demo Address","licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"9","shop_id":"0","name":"Arup Bose","username":"01571721910","email":null,"phone":"4556814222","password":"$2y$10$IXQgMnO\/519ppsDUuSC0feLQy3XzNH11\/PFnQD1hI0Y3cNm1uqrBi","avatar_id":null,"role":"2","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-06-04 06:14:26","updated_at":"2020-06-13 11:44:53","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"10","shop_id":"0","name":"Purchase Manager","username":"98765432100","email":"p@m.com","phone":"98765432100","password":"$2y$10$aSSZE0542\/ABBZRG1vH10uyLQnRqPLNqd.qcMnuNmrqLgpkjk5\/zO","avatar_id":null,"role":"10","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-06-10 04:54:08","updated_at":"2020-06-10 04:54:31","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"0"},
        {"id":"11","shop_id":"4","name":"werwer","username":"22222222222","email":"erer@fdf.d","phone":"3434343","password":"$2y$10$qj49f6q0qZqmlSALjTfiJOo\/u8tFRr1FMHFsfaAxY2CztNzyt5pG2","avatar_id":null,"role":"3","status":"1","email_verified_at":null,"remember_token":"4aMsQDUyB0T3kTP3vuItyYSUhbQr3izaViGKMg60qTW6iZW8Fwoh6Yfb6fSJ","created_at":"2020-06-13 16:29:11","updated_at":"2020-06-13 16:39:14","otp_code":"938111","nid_image":"29","licence_image":"31","user_balance":"0.00","user_address":"fdfdsf","licence_image_last":"33","nid_image_last":"30","location_tracker_id":"0"},
        {"id":"12","shop_id":"0","name":"Customer Service","username":"11111111111","email":null,"phone":"11111111111","password":"$2y$10$SAVEJvDq7rGHGCIqTSvazuxCBSRd9\/qJQhy2efWy\/2n6JToppJ2re","avatar_id":null,"role":"11","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-06-16 07:39:46","updated_at":"2020-06-16 07:39:46","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":"1"},
        {"id":"13","shop_id":"0","name":"sdfsdfsdf","username":"42342342343","email":null,"phone":"3424243434324","password":"$2y$10$Yv.N2fL7RGhOyKs4D88TrOxZevZCC9alvIP3LGJW2X\/4UuavHbBNG","avatar_id":null,"role":"10","status":"1","email_verified_at":null,"remember_token":null,"created_at":"2020-06-16 07:48:52","updated_at":"2020-06-16 07:48:52","otp_code":null,"nid_image":null,"licence_image":null,"user_balance":"0.00","user_address":null,"licence_image_last":null,"nid_image_last":null,"location_tracker_id":null}
    ];

    public
}
