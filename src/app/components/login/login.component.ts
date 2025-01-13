import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../app.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [LoaderComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})

export class LoginComponent {

	constructor(public appService: AppService, private router: Router) {

		this.appService.manageInterval();
	}

	async loginFunc(e: SubmitEvent) {

		e.preventDefault();

		const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
		const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const email = (document.getElementsByClassName('register-email')[0] as HTMLInputElement);
        const password = (document.getElementsByClassName('register-password')[0] as HTMLInputElement);


		if (email.value !== '' && password.value !== '') {

			// activate loader //
			this.appService.activeLoader();
			//



			const response = await fetch(`${this.appService.hostname}/api/finduser`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					email: email.value,
					password: password.value
				})
			})

			const responseData = await response.json();

			if (responseData.hasOwnProperty('logged')) {

                if (responseData.logged) {




                    this.appService.user = Object.assign({}, responseData.user[0]);
					this.appService.isLogged = true;




					// check message contact => envelope //

					const responseMessageContact = await fetch(`${this.appService.hostname}/api/findmessagecontactbyuserid/${this.appService.user.id}`, {
						method: 'GET'
					});

					const responseMessageContactData = await responseMessageContact.json();


					this.checkMessageContactRead(responseMessageContactData.result);







					// check message offer => envelope //

					const responseMessage = await fetch(`${this.appService.hostname}/api/findreceivemessagebyuserid/${this.appService.user.id}`, {
						method: 'GET'
					});

					const responseMessageData = await responseMessage.json();


					this.checkMessageRead(responseMessageData.result);









                    // document.cookie = `userGiveDiscount=${JSON.stringify(responseData.user[0])}`;

					document.cookie = `userGiveDiscount=${JSON.stringify(responseData.sessionKey)};path=/`;





					errorConfirmDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_confirm');
                    errorDiv.classList.remove('active_error');
                    errorDiv.classList.remove('active_success');
                

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });





					

					this.appService.timeoutRoute = setTimeout(() => {

                        // deactivate loader //
                        this.appService.inactiveLoader();
                        //



                        errorDivSpan.textContent = 'Utilisateur authentifié avec succès';

                    	errorDiv.classList.add('active_success');




                        setTimeout(() => {

                            errorDiv.classList.remove('active_success');
                        }, 1500);


                        setTimeout(() => {

                            window.location.href = '/';
                        }, 2000);

                    }, 3500);
                }




				else if (!responseData.logged) {


					if (responseData.message.startsWith('Wrong password')) {
	
						errorConfirmDiv.classList.remove('active_confirm');
						errorDiv.classList.remove('active_confirm');
						errorDiv.classList.remove('active_error');
						errorDiv.classList.remove('active_success');
					
	
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});



						this.appService.timeoutRoute = setTimeout(() => {

							// deactivate loader //
							this.appService.inactiveLoader();
							//
	
	
	
							errorDivSpan.textContent = 'Mot de passe incorrect';
	
							errorDiv.classList.add('active_error');
	
	
	
	
							setTimeout(() => {
	
								errorDiv.classList.remove('active_error');
							}, 2500);
	
						}, 1000);
	
						// errorDivSpan.textContent = 'Mot de passe incorrect';
	
						// errorDiv.classList.add('active_error');
	
						// this.appService.timeoutRoute = setTimeout(() => {
	
						// 	errorDiv.classList.remove('active_error');
	
						// }, 2500);
					}






					else if (responseData.message.startsWith('User not found')) {

						errorConfirmDiv.classList.remove('active_confirm');
						errorDiv.classList.remove('active_confirm');
						errorDiv.classList.remove('active_error');
						errorDiv.classList.remove('active_success');
					
	
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});


						this.appService.timeoutRoute = setTimeout(() => {

							// deactivate loader //
							this.appService.inactiveLoader();
							//
	
	
	
							errorDivSpan.textContent = 'Utilisateur non trouvé';
	
							errorDiv.classList.add('active_error');
	
	
	
	
							setTimeout(() => {
	
								errorDiv.classList.remove('active_error');
							}, 2500);
	
						}, 1000);
					}
				}
            }
		}
	}












	checkMessageContactRead(array_message_contact: Array<any>) {

		if (array_message_contact.length > 0) {
			
			for (let i = 0; i < array_message_contact.length; i++) {

				if ((array_message_contact[i].message_contact_user_receive_id == this.appService.user.id) &&
					(array_message_contact[i].message_contact_user_receive_id_read == 'false')) {

						this.appService.messageContactNotRead = 'true';
						break;
					}
			}

			document.cookie = `messageContactNotReadGiveDiscount=${this.appService.messageContactNotRead};path=/`;
		}
	}





	checkMessageRead(array_message: Array<any>) {

		if (array_message.length > 0) {

			for (let i = 0; i < array_message.length; i++) {

				if ((array_message[i].message_user_receive_id == this.appService.user.id) &&
					(array_message[i].message_user_receive_id_read == 'false')) {

						this.appService.messageNotRead = 'true';
						break;
					}
			}

			document.cookie = `messageNotReadGiveDiscount=${this.appService.messageNotRead};path=/`;
		}
	}
}
