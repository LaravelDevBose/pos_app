import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(public toastController: ToastController) {}

    async presentToast(message:string, cssClass='my-toast', duration= 2000, position = "bottom") {
        const toast = await this.toastController.create({
            message: message,
            duration: duration,
            animated: true,
            mode: "ios",
            cssClass: cssClass,
            position: "bottom",
        });
        return  await toast.present();
    }

    async presentToastWithOptions() {
        const toast = await this.toastController.create({
            header: 'Toast header',
            message: 'Click to Close',
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    icon: 'star',
                    text: 'Favorite',
                    handler: () => {
                        console.log('Favorite clicked');
                    }
                }, {
                    text: 'Done',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        return await toast.present();
    }
}
