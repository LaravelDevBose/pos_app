import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private isLoading = false;

    constructor(
        private loadingCtrl: LoadingController,
    ) {
    }

    public async present(message: string, dur = 9000) {
        const loading = await this.loadingCtrl.create({
            keyboardClose: true,
            message,
            duration: dur,
            translucent: true,
            showBackdrop: true,
            mode: 'ios',
            spinner: 'lines',
            cssClass: 'my-loader-class'
        });
        return await loading.present();
    }

    public dismiss() {
        this.loadingCtrl.dismiss();
    }
}
