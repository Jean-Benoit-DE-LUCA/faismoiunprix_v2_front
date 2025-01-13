import { js_animations } from '../../../js_miscellaneous/js_animations';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppService } from '../../app.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',

    animations: [ js_animations ]
})

export class HeaderComponent {


    constructor(private router: Router, public appService: AppService) {
        
    }



    /* CLICK MENU */

    handleClickMenu(e: MouseEvent | undefined) {


        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);


        if (this.appService.timeoutRoute !== null) {


            errorConfirmDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_error');
            errorDiv.classList.remove('active_success');
            mainElement.classList.remove('blur');

            clearTimeout(this.appService.timeoutRoute);

            this.appService.timeoutRoute = null;
        }



        






        const nav = (document.getElementsByClassName('nav')[0] as HTMLElement);
        const menuBar = (document.getElementsByClassName('header-div-menu-div-span-bar') as HTMLCollectionOf<HTMLSpanElement>);

        for (let i = 0; i < menuBar.length; i++) {

            menuBar[i].classList.toggle('active');
        }





        if (menuBar[0].classList.contains('active')) {

            nav.classList.add('active');



            const crossFilterOffer = (document.getElementsByClassName('cross-filter-offer')[0] as HTMLButtonElement);

            const filterSection = (document.getElementsByClassName('section-search-filter-div')[0] as HTMLDivElement);
            const crossFilter = (document.getElementsByClassName('cross-filter')[0] as HTMLButtonElement);

            const divSort = (document.getElementsByClassName('section-search-sort-div')[0] as HTMLDivElement);
            const crossFilterSort = (document.getElementsByClassName('cross-filter')[1] as HTMLButtonElement);


            if (crossFilterOffer !== undefined) {

                crossFilterOffer.click();
            }

            if (crossFilter !== undefined && filterSection.classList.contains('active')) {

                crossFilter.click();
            }

            if (crossFilterSort !== undefined && divSort.classList.contains('active')) {

                crossFilterSort.click();
            }


        }

        else {

            nav.classList.remove('active');
        }
    }










    /* CLICK ANCHOR MENU */

    handleClickAnchorMenu(e: MouseEvent) {



        const nameLinkMenu = ((e.currentTarget as HTMLAnchorElement).getElementsByClassName('nav-ul-a-li')[0] as HTMLLIElement).textContent?.trim();




        if (nameLinkMenu !== 'Accueil') {

            if (this.appService.timeoutScrollCarousel !== null) {

                clearTimeout(this.appService.timeoutScrollCarousel);

                this.appService.timeoutScrollCarousel == null;
            }
        }



        if (nameLinkMenu !== 'Mon compte') {

            if (this.appService.intervalExpireProduct !== null) {

                clearInterval(this.appService.intervalExpireProduct);

                this.appService.intervalExpireProduct == null;
            }
        }



        this.handleClickMenu(undefined);
    }












    handleClickInputSearch(e: Event) {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);



        mainElement.classList.remove('blur');
        errorConfirmDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_error');
        errorDiv.classList.remove('active_success');
    }



















    /*--- CLICK CROSS ANIM HEADER ---*/

    handleClickCrossAnimHeader(e: Event) {

        const divTextHeader = (document.getElementsByClassName('header-title-anchor-div')[0] as HTMLDivElement);
        const divTextHeaderFake = (document.getElementsByClassName('header-title-anchor-div-fake')[0] as HTMLDivElement);
        const crossSpan = (document.getElementsByClassName('header-title-anchor-div-span-cross')[0] as HTMLSpanElement);
        const arrowImg = (document.getElementsByClassName('header-title-anchor-div-img-arrow')[0] as HTMLImageElement);

        const divArrowElement = (document.getElementsByClassName('header-title-anchor-div-div')[0] as HTMLDivElement);

        if ((e.currentTarget as any).className.includes('header-title-anchor-div-span-cross')) {

            divTextHeaderFake.classList.remove('active');
            divTextHeaderFake.classList.add('inactive');

            divTextHeader.classList.remove('active')
            divTextHeader.classList.add('inactive');

            crossSpan.classList.remove('active');
            crossSpan.classList.add('inactive');
            
            arrowImg.classList.remove('inactive');
            arrowImg.classList.remove('arrow-down');
            arrowImg.classList.add('active');



            divArrowElement.classList.remove('active');
        }





        else if ((e.currentTarget as any).className.includes('header-title-anchor-div-img-arrow')) {

            arrowImg.classList.remove('active');
            arrowImg.classList.add('inactive');
            arrowImg.classList.add('arrow-down');

            crossSpan.classList.remove('inactive');
            crossSpan.classList.add('active');

            divTextHeaderFake.classList.remove('inactive');
            divTextHeaderFake.classList.add('active');

            divTextHeader.classList.remove('inactive');
            divTextHeader.classList.add('active');
        }

        


        
    }










    handleMouseOverCross(e: Event) {
        
        const crossSpan = (document.getElementsByClassName('header-title-anchor-div-span-cross')[0] as HTMLSpanElement);

        crossSpan.classList.remove('anim');



        if (crossSpan.classList.contains('active')) {

            crossSpan.classList.remove('active');
        }
    }










    async handleClickAnchorArrowHeader(e: Event) {
        
        const divArrowElement = (document.getElementsByClassName('header-title-anchor-div-div')[0] as HTMLDivElement);

        e.preventDefault();

        divArrowElement.classList.toggle('active');

        
        if (divArrowElement.classList.contains('active')) {

            js_animations('animHeaderDivRandom'); // CENTRALIZE JS ANIMATIONS //

            const response = await fetch(`${this.appService.hostname}/api/randomproduct`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });


            const responseData = await response.json();

            

            

            if (responseData.result !== null) {

                this.appService.getRandomProduct = responseData.result;
            }


        }

    }    
}
