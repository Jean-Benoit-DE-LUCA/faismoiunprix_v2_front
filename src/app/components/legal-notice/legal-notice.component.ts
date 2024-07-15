import { Component } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-legal-notice',
    standalone: true,
    imports: [],
    templateUrl: './legal-notice.component.html',
    styleUrl: './legal-notice.component.css'
})

export class LegalNoticeComponent {

    constructor(public appService: AppService, private router: Router) {

    }
}
