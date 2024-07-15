import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {

    constructor(private Location: Location, public router: Router) {

        

        setTimeout(() => {

            this.setFooterSize();
        }, 125);
    }






    /*--- SET FOOTER DIMENSIONS ---*/

    setFooterSize() {

        const body = (document.getElementsByTagName('body')[0] as HTMLBodyElement);
        const container = (document.getElementsByClassName('container')[0] as HTMLDivElement);
        const footer = (document.getElementsByClassName('footer')[0] as HTMLElement);

        footer.style.setProperty('--widthBody', body.clientWidth + 'px');
    }
}
