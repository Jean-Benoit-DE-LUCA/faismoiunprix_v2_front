import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cookies',
    standalone: true,
    imports: [],
    templateUrl: './cookies.component.html',
    styleUrl: './cookies.component.css'
})
export class CookiesComponent {

    constructor(public appService: AppService, private router: Router) {

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }
}
