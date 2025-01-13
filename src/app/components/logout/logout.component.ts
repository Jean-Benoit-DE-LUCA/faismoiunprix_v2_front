import { Component } from '@angular/core';

import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [],
    template: '',
    styleUrl: './logout.component.css'
})

export class LogoutComponent {

    constructor(public appService: AppService, private router: Router) {

        this.logout();
    }

    async logout() {


        const response = await fetch(`${this.appService.hostname}/api/deletedatasession/${this.appService.user.id}`, {
            method: 'DELETE'
        });

        const responseData = await response.json();








        const responseJwt = await fetch(`${this.appService.hostname}/api/deletejwt/${this.appService.user.id}`, {
            method: 'DELETE'
        });


        const responseJwtData = await responseJwt.json();







        this.appService.user = Object.assign({}, {
            id: 0,
            name: '',
            firstname: '',
            email: '',
            phone: '',
            password: '',
            created_at: '',
            updated_at: '',
            jwt: ''
        });

        this.appService.isLogged = false;

        this.appService.messageContactNotRead = 'false';
        this.appService.messageNotRead = 'false';

        document.cookie = `userGiveDiscount=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        document.cookie = `messageContactNotReadGiveDiscount=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        document.cookie = `messageNotReadGiveDiscount=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;



        this.router.navigate(['/']);
    }
}
