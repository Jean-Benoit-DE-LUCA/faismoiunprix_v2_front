import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [],
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {

    constructor(public appService: AppService, private router: Router) {
        
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }
}
