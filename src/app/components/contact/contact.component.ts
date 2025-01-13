import { Component } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [LoaderComponent],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css'
})

export class ContactComponent {

    constructor(public appService: AppService) {

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }

    async handleSubmitContact(e: Event) {

        e.preventDefault();

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
		const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const nameContact = (document.getElementById('contact-name') as HTMLInputElement);
        const firstNameContact = (document.getElementById('contact-firstname') as HTMLInputElement);
        const emailContact = (document.getElementById('contact-email') as HTMLInputElement);
        const textareaContact = (document.getElementById('contact-textarea') as HTMLTextAreaElement);

        if (nameContact.value.trim().length === 0 ||
            firstNameContact.value.trim().length === 0 ||

            (emailContact.value.trim().length === 0 || !emailContact.value.trim().includes('@')) ||

            textareaContact.value.trim().length < 20)

            {
                errorConfirmDiv.classList.remove('active_confirm');
                errorDiv.classList.remove('active_confirm');
                errorDiv.classList.remove('active_error');
                errorDiv.classList.remove('active_success');
            

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });



                errorDivSpan.textContent = 'Veuillez remplir tous les champs correctement';

                errorDiv.classList.add('active_error');




                setTimeout(() => {

                    errorDiv.classList.remove('active_error');
                }, 2500);
	
            }

        

        else {


            // activate loader //
			this.appService.activeLoader();
			//



            const response = await fetch(`${this.appService.hostname}/api/sendcontact`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    nameContact: nameContact.value,
                    firstNameContact: firstNameContact.value,
                    emailContact: emailContact.value,
                    textareaContact: textareaContact.value
                })
            });


            const responseData = await response.json();



            if (responseData.flag) {

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



                    errorDivSpan.textContent = 'Message envoyé avec succès, nous vous répondrons dans les plus brefs délais';

                    errorDiv.classList.add('active_success');




                    // setTimeout(() => {

                    //     errorDiv.classList.remove('active_success');
                    // }, 2500);


                }, 2500);








                // clean inputs //

                nameContact.value = '';
                firstNameContact.value = '';
                emailContact.value = '';
                textareaContact.value = '';
            }






            else if (!responseData.flag) {

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



                    errorDivSpan.textContent = 'Une erreur est survenue, réessayez ultérieurement';

                    errorDiv.classList.add('active_error');




                    setTimeout(() => {

                        errorDiv.classList.remove('active_error');
                    }, 2500);

                }, 2500);
            }
        }
    }
}
