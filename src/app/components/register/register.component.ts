import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../app.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    constructor(public appService: AppService, private router: Router) {

        this.appService.manageInterval();
    }

    async registerFunc(e: SubmitEvent) {

        e.preventDefault();

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
		const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const name = (document.getElementsByClassName("register-name")[0] as HTMLInputElement);
        const firstname = (document.getElementsByClassName("register-firstname")[0] as HTMLInputElement);
        const email = (document.getElementsByClassName("register-email")[0] as HTMLInputElement);
        const phone = (document.getElementsByClassName("register-phone")[0] as HTMLInputElement);
        const password = (document.getElementsByClassName("register-password")[0] as HTMLInputElement);
        const passwordConfirmation = (document.getElementsByClassName("register-password-confirmation")[0] as HTMLInputElement);

        console.log(name.value);
        console.log(firstname.value);
        console.log(email.value);
        console.log(phone.value);
        console.log(password.value);
        console.log(passwordConfirmation.value);

        if ((name.value !== '' &&
            firstname.value !== '' &&
            email.value !== '' &&
            phone.value !== '' &&
            password.value !== '' &&
            passwordConfirmation.value !== '') &&

            (password.value == passwordConfirmation.value)
            )
        {

            const response = await fetch(`${this.appService.hostname}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.value,
                    firstname: firstname.value,
                    email: email.value,
                    phone: phone.value,
                    password: password.value
                })
            });

            const responseData = await response.json();

            console.log(responseData);

            if (responseData.hasOwnProperty('user')) {

                if (responseData.user !== null) {

                    this.appService.user = Object.assign({}, responseData.user[0]);
                    this.appService.isLogged = true;



                    document.cookie = `userGiveDiscount=${JSON.stringify(responseData.sessionKey)};path=/`;

                    // document.cookie = `userGiveDiscount=${JSON.stringify(responseData.user[0])}`;

                    errorConfirmDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_error');
                    errorDiv.classList.remove('active_success');
                

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    errorDivSpan.textContent = 'Utilisateur enregistré avec succès';

                    errorDiv.classList.add('active_success');



					this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_success');

                    }, 2500);



                    this.appService.timeoutRoute = setTimeout(() => {

                        window.location.href = '/';
                    }, 3000);
                }






                else if (responseData.user == null) {

                    if (responseData.message.startsWith('User already registered')) {

                        errorConfirmDiv.classList.remove('active_confirm');
                        errorDiv.classList.remove('active_confirm');
                        errorDiv.classList.remove('active_error');
                        errorDiv.classList.remove('active_success');
                    

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });

                        errorDivSpan.textContent = 'Utilisateur déjà enregistré';

                        errorDiv.classList.add('active_error');



                        this.appService.timeoutRoute = setTimeout(() => {

                            errorDiv.classList.remove('active_error');

                        }, 2500);
                    }
                }
            }

            
        }



        else if ((name.value !== '' &&
                firstname.value !== '' &&
                email.value !== '' &&
                phone.value !== '' &&
                password.value !== '' &&
                passwordConfirmation.value !== '') &&

                (password.value !== passwordConfirmation.value)
                ) {

            errorConfirmDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_error');
            errorDiv.classList.remove('active_success');
        

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            errorDivSpan.textContent = 'Les mots de passe ne correspondent pas';

            errorDiv.classList.add('active_error');



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');

            }, 2500);
        }


        else {

            errorConfirmDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_error');
            errorDiv.classList.remove('active_success');
        

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            errorDivSpan.textContent = 'Veuillez remplir tous les champs';

            errorDiv.classList.add('active_error');



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');

            }, 2500);
        }


    }
}
