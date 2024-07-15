import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent {



    intervalScrollCarousel: ReturnType<typeof setInterval> | null= null;
    timeoutScrollCarousel: ReturnType<typeof setTimeout> | null = null;

    constructor(public appService: AppService, private router: Router) {

        this.appService.manageInterval();
        
        this.appService.getLastProductArrayResult();


        setTimeout(() => {
            console.log(this.appService.getLastProductArray);
        }, 1000);
    }

}
