import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-myaccount',
    standalone: true,
    imports: [RouterModule, CommonModule, LoaderComponent],
    templateUrl: './myaccount.component.html',
    styleUrl: './myaccount.component.css'
})

export class MyaccountComponent {


    productArray: Array<any> = [];


    constructor(public appService: AppService, private router: Router) {

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });






        

        this.appService.manageInterval();

        this.getProductByUserId(this.appService.user.id);

    }






    async getProductByUserId(user_id: number) {



        if (this.appService.user.id > 0) {

            const response = await fetch(`${this.appService.hostname}/api/getproductsbyuserid/${this.appService.user.id}`, {

                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.appService.user.jwt}`
                }
            });

            const responseData = await response.json();


            this.productArray = responseData.result.slice();
        }

        else {

            setTimeout(() => {

                this.getProductByUserId(user_id);
            }, 125);
        }
    }











    async handleUpdateUserData(e: SubmitEvent) {

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





        if ((name.value !== '' &&
            firstname.value !== '' &&
            email.value !== '' &&
            phone.value !== '' &&
            password.value !== '' &&
            passwordConfirmation.value !== '') &&

            (password.value == passwordConfirmation.value)
            )
        {

            const response = await fetch(`${this.appService.hostname}/api/updateuser`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.appService.user.jwt}`
                },
                body: JSON.stringify({
                    name: name.value,
                    firstname: firstname.value,
                    email: email.value,
                    phone: phone.value,
                    password: password.value,
                    user_id: this.appService.user.id
                })
            });

            const responseData = await response.json();




            if (!responseData.flag) {


                if (responseData.message.startsWith('You must log in to update your profile')) {

                    errorConfirmDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_error');
                    errorDiv.classList.remove('active_success');
                

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    errorDivSpan.textContent = 'Veuillez vous authentifier afin de procéder à des modifications de profil';

                    errorDiv.classList.add('active_error');

                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_error');

                    }, 2500);
                }



                else if (responseData.message.startsWith('Please log in again')) {

                    errorConfirmDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_error');
                    errorDiv.classList.remove('active_success');
                

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    errorDivSpan.textContent = 'Veuillez vous authentifier de nouveau afin de modifier le profil';

                    errorDiv.classList.add('active_error');

                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_error');

                    }, 2500);
                }
            }





            else if (responseData.flag) {

                errorConfirmDiv.classList.remove('active_confirm');
                errorDiv.classList.remove('active_confirm');
                errorDiv.classList.remove('active_error');
                errorDiv.classList.remove('active_success');
            

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                errorDivSpan.textContent = 'Modification des données effectuée avec succès';

                errorDiv.classList.add('active_success');



                this.appService.timeoutRoute = setTimeout(() => {

                    errorDiv.classList.remove('active_success');

                }, 2500);
            }

        }

        else if ((name.value !== '' &&
            firstname.value !== '' &&
            email.value !== '' &&
            phone.value !== '' &&
            password.value !== '' &&
            passwordConfirmation.value !== '') &&

            (password.value !== passwordConfirmation.value)
            )
        {

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







    // DELETE ACCOUNT //

    async handleDeleteAccount(e: SubmitEvent) {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        e.preventDefault();




        // if user logged in //

        if (this.appService.user.id > 0) {



            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'Êtes-vous sur de supprimer votre compte ? Cette action entraînera la suppression de tous vos produits, offres, messages. Cette action est irréversible';
                errorConfirmDiv.classList.add('active_confirm');
                errorDiv.classList.add('active_confirm');
                mainElement.classList.add('blur');

                const spanHidden = document.createElement('span');
                spanHidden.setAttribute('class', 'error-div-span-hidden');
                spanHidden.setAttribute('data-user-id-delete', (this.appService.user.id).toString());

                errorDiv.append(spanHidden);

            }, 750);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }



        else {

            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'Veuillez vous connecter à votre compte afin de poursuivre';

                errorDiv.classList.add('active_error');

            }, 750);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');
            }, 2500);
        }

        // -- //
    }
}
