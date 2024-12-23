import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.css'
})

export class LoaderComponent {

    constructor(public appService: AppService, private router: Router) {

    }
}
