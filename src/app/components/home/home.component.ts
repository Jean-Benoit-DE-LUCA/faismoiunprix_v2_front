import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../app.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, CommonModule, LoaderComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent {



    intervalScrollCarousel: ReturnType<typeof setInterval> | null= null;
    timeoutScrollCarousel: ReturnType<typeof setTimeout> | null = null;

    constructor(public appService: AppService, private router: Router) {

        this.appService.inactiveLoader();

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });








        this.appService.manageInterval();
        
        this.appService.getLastProductArrayResult();


        setTimeout(() => {
            this.manageHomePresentationText();
        }, 1000);



        


    }





    async manageHomePresentationText() {

        const promiseSpanAvailable = new Promise<HTMLCollectionOf<HTMLSpanElement>>(resolve => {

            const spanText = (document.getElementsByClassName('section-home-div-presentation-p-span') as HTMLCollectionOf<HTMLSpanElement>);

            if (spanText.length > 0) {

                resolve(spanText);
            }

            else if (spanText.length == 0) {

                setTimeout(() => {

                    this.manageHomePresentationText();
                }, 125);
            }
        });



        const responsePromiseSpanAvailable: HTMLCollectionOf<HTMLSpanElement> = await promiseSpanAvailable;




        if (responsePromiseSpanAvailable.length > 0) {

            let transitionDelay = 0;

            for (let i = 0; i < responsePromiseSpanAvailable.length; i++) {

                const spanWidth = responsePromiseSpanAvailable[i].offsetWidth;

                (responsePromiseSpanAvailable[i].parentElement as HTMLSpanElement).style.width = `${spanWidth}px`;

                responsePromiseSpanAvailable[i].style.display = 'inline-block';
                responsePromiseSpanAvailable[i].style.width = '0';
                responsePromiseSpanAvailable[i].style.opacity = '1';

                responsePromiseSpanAvailable[i].style.transition = `width .8s ${transitionDelay}s linear`;

                if (i == responsePromiseSpanAvailable.length - 1) {
                    responsePromiseSpanAvailable[i].style.animation = 'blink-caret 2s infinite';
                }

                else {
                    responsePromiseSpanAvailable[i].style.animation = 'blink-caret .8s';
                }
                
                responsePromiseSpanAvailable[i].style.animationDelay = `${transitionDelay}s`;


                //TODO => CHECK ERROR HAPPENS RANDOMLY "UNDEFINED"

                setTimeout(() => {
                    
                    responsePromiseSpanAvailable[i].style.width = `${spanWidth}px`;
                }, /*25*/ 5);
                
                transitionDelay += 0.8;
            }
        }
    }

}
