import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { ErrorComponent } from './components/error/error.component';

import { AppService } from './app.service';
import { FooterComponent } from './components/footer/footer.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet,
              HeaderComponent,
              FooterComponent,
              ErrorComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

export class AppComponent {

    constructor(public appService: AppService) {

    }
}
