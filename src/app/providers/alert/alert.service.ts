import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(
        public alertCtrl: AlertController,
        private route: Router,
    ) { }

    async present(header: string, message: string, cssClass="") {
        const alertEl = await this.alertCtrl.create({
            header,
            message,
            animated: true,
            cssClass: cssClass
        });

        return await alertEl.present();
    }

    async presentWithRoute(header: string, message: string, routeLink: string= '') {
        await this.alertCtrl.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.route.navigate([routeLink]);
                    }
                }
            ]
        }).then(alertEl => {
            alertEl.present();
            setTimeout(() => {
                alertEl.dismiss();
                this.route.navigate([routeLink]);
            }, 2000);
        });
    }

    async dismiss() {
        return await this.alertCtrl.dismiss().then(() => console.log('dismissed'));
    }
}
