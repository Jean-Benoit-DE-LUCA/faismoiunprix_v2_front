import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

export interface PostData {
    title: string;
    category_id: number;
    description: string;
    city: string;
    zip: string;
    phone: string;
    email: string;
    delivery: boolean;
    picture: object;
    offer: string;
    user_id: number;
}



@Component({
    selector: 'app-post',
    standalone: true,
    imports: [CommonModule,
              LoaderComponent
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})

export class PostComponent {

    objectPost: PostData = {
        title: '',
        category_id: 0,
        description: '',
        city: '',
        zip: '',
        phone: '',
        email: '',
        delivery: false,
        picture: {},
        offer: '',
        user_id: 0
    };

    objectNameFile: any = {
        nameFile1: '',
        nameFile2: '',
        nameFile3: ''
    };

    allActive: boolean = false;




    constructor(public appService: AppService, private router: Router) {

        this.appService.manageInterval();

        this.waitTitleElement();
        
    }

    waitTitleElement() {

        const inputTitle = (document.getElementsByClassName('section-post-title-input')[0] as HTMLInputElement);

        if (inputTitle !== undefined) {

            this.checkInputTitlePostDivClassContainsOnNotAllActiveNewPostObjectTitleLengthMoreThanZero(inputTitle.parentElement as HTMLDivElement);

            return;
        }

        setTimeout(() => {

            this.waitTitleElement();
        }, 50);
    };










    checkInputTitlePostDivClassContainsOnNotAllActiveNewPostObjectTitleLengthMoreThanZero(divElement: HTMLDivElement) {

        if (divElement.classList.contains('on') && 
            !divElement.classList.contains('all-active') &&
            this.appService.newPostObject.title.length > 0) {

            this.appService.inputTitlePostDivClass_ContainsOn_NotAllActive_NewPostObjectTitleLengthMoreThanZero = true;

            




            this.checkRememberSection()
            
        }
    }






    checkRememberSection() {

        const sectionRememberPost = (document.getElementsByClassName('section-remember-post')[0] as HTMLElement);

        

        if (sectionRememberPost !== undefined) {

            this.disableEnableButtonTitle('disable');

            return;
        }

        else {

            setTimeout(() => {

                this.checkRememberSection();
            }, 125);
        }
    }




    async handleClickButtonNextPost(e: MouseEvent) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const divSectionTitle = (document.getElementsByClassName('section-post-title-div')[0] as HTMLDivElement);
        const divSectionDescription = (document.getElementsByClassName('section-post-description-div')[0] as HTMLDivElement);
        const divSectionPicture = (document.getElementsByClassName('section-post-picture-div')[0] as HTMLDivElement);
        const divSectionOffer = (document.getElementsByClassName('section-post-offer-div')[0] as HTMLDivElement);

        const inputTitle = (document.getElementsByClassName('section-post-title-input')[0] as HTMLInputElement);
        const inputOffer = (document.getElementsByClassName('section-post-offer-input')[0] as HTMLInputElement);

        const selectCategory = (document.getElementsByClassName('section-post-title-select-category')[0] as HTMLSelectElement);



        if ((e.currentTarget as HTMLButtonElement).name == 'button-post-title') {

            



            if (inputTitle.value.length >= 4 && selectCategory.value !== '-') {

                this.objectPost.title = inputTitle.value;
                this.objectPost.category_id = Number(selectCategory.value);

                this.appService.newPostObject.title = inputTitle.value;
                this.appService.newPostObject.category_id = Number(selectCategory.value);

                this.functionAnimSection(divSectionTitle, divSectionDescription);

                window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                });

            }

            else if (inputTitle.value.length < 4) {

                inputTitle.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                inputTitle.focus();
            }

            else if (selectCategory.value == '-') {

                selectCategory.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                selectCategory.focus();
            }
        }





        else if ((e.currentTarget as HTMLButtonElement).name == 'button-post-description') {

            const textareaDescription = (document.getElementsByClassName('section-post-description-textarea')[0] as HTMLTextAreaElement);

            const cityInputDescription = (document.getElementsByClassName('section-post-description-city-input')[0] as HTMLInputElement);
            const zipInputDescription = (document.getElementsByClassName('section-post-description-zip-input')[0] as HTMLInputElement);
            const phoneInputDescription = (document.getElementsByClassName('section-post-description-phone-input')[0] as HTMLInputElement);
            const emailInputDescription = (document.getElementsByClassName('section-post-description-email-input')[0] as HTMLInputElement);


            const inputRadio = (document.getElementsByClassName('section-post-description-delivery') as HTMLCollectionOf<HTMLInputElement>);

            if (cityInputDescription.value.trim().length > 0 && zipInputDescription.value.trim().length > 0 && phoneInputDescription.value.trim().length > 0 && emailInputDescription.value.trim().length > 0 && (emailInputDescription.value.trim().includes('@') && emailInputDescription.value.trim().includes('.'))) {

                this.objectPost.description = textareaDescription.value;
                this.objectPost.city = cityInputDescription.value.trim();
                this.objectPost.zip = zipInputDescription.value.trim();
                this.objectPost.phone = phoneInputDescription.value.trim();
                this.objectPost.email = emailInputDescription.value.trim();

                
                this.appService.newPostObject.description = textareaDescription.value;
                this.appService.newPostObject.city = cityInputDescription.value.trim();
                this.appService.newPostObject.zip = zipInputDescription.value.trim();
                this.appService.newPostObject.phone = phoneInputDescription.value.trim();
                this.appService.newPostObject.email = emailInputDescription.value.trim();
                
                for (let i = 0; i < inputRadio.length; i++) {

                    if (inputRadio[i].checked) {
    
                        if (inputRadio[i].id.includes('delivery-yes')) {
    
                            this.objectPost.delivery = true;

                            this.appService.newPostObject.delivery = true;
                        }
    
                        else if (inputRadio[i].id.includes('delivery-no')) {
    
                            this.objectPost.delivery = false;

                            this.appService.newPostObject.delivery = false;
                        }
                    }
                }
    
    
                this.functionAnimSection(divSectionDescription, divSectionPicture);

                window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                });
            }



            else if (cityInputDescription.value.trim().length == 0) {

                cityInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                cityInputDescription.focus();
            }

            else if (zipInputDescription.value.trim().length == 0) {

                zipInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                zipInputDescription.focus();
            }

            else if (phoneInputDescription.value.trim().length == 0) {

                phoneInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                phoneInputDescription.focus();
            }

            else if (emailInputDescription.value.trim().length == 0 || !emailInputDescription.value.trim().includes('@') || !emailInputDescription.value.trim().includes('.')) {

                emailInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                emailInputDescription.focus();
            }

        }






        else if ((e.currentTarget as HTMLButtonElement).name == 'button-post-picture') {

            this.functionAnimSection(divSectionPicture, divSectionOffer);

            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
        }







        else if ((e.currentTarget as HTMLButtonElement).name == 'button-post-offer') {

            this.objectPost.offer = (inputOffer.value.trim());
            
            this.appService.newPostObject.offer = inputOffer.value.trim();

            this.functionAnimSection(divSectionOffer, divSectionTitle);
            this.functionAnimSection(divSectionOffer, divSectionDescription);
            this.functionAnimSection(divSectionOffer, divSectionPicture);
            this.functionAnimSection(divSectionOffer, divSectionOffer);

            this.allActive = true;

            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
        }






        else if ((e.currentTarget as HTMLButtonElement).name == 'button-post-offer-post') {


            this.appService.newPostObject = Object.assign({}, this.objectPost);



            // if user logged in //

            if (this.appService.user.id > 0) {

                (this.appService.newPostObject as any)['user_id'] = this.appService.user.id;



                this.appService.timeoutRoute = setTimeout(() => {

                    errorDivSpan.textContent = 'On confirme l\'ajout ?';
                    errorConfirmDiv.classList.add('active_confirm');
                    errorDiv.classList.add('active_confirm');
                    mainElement.classList.add('blur');
                }, 750);
    
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            // -- //





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

        }
    }










    handleClickCrossPicture(e: MouseEvent) {

        e.preventDefault();

        const imgElement = (((e.currentTarget as HTMLButtonElement).parentElement as HTMLDivElement).getElementsByClassName('section-post-picture-insert-element-img')[0] as HTMLImageElement);

        const imgAnchor = ((e.currentTarget as HTMLButtonElement).parentElement?.getElementsByClassName('anchor-input-file')[0] as HTMLAnchorElement);

        const inputElement = (((e.currentTarget as HTMLButtonElement).parentElement as HTMLDivElement).getElementsByClassName('add-picture-input-file')[0] as HTMLInputElement);






        const currentInputNumber = ((e.currentTarget as HTMLButtonElement).parentElement?.getElementsByClassName('add-picture-input-file')[0].id.replace('add-picture-input-file-', ''));

        const currentNameFile = `nameFile${currentInputNumber}`;





        // remove input file from array //

        for (const key of Object.keys(this.objectPost.picture)) {

            if ((this.objectPost.picture as any)[key].name == inputElement.value.replace('C:\\fakepath\\', '') ||
                (this.objectPost.picture as any)[key].name == this.objectNameFile[currentNameFile]) {



                delete (this.objectPost.picture as any)[key];

                inputElement.value = '';
            }

        }



        // reset currentNameFile to '' //

        this.objectNameFile[currentNameFile] = '';






        // set no-image //

        imgElement.src = this.appService.hostname + '/pictures/no-image.svg';
        imgElement.classList.add('no-image');

        imgAnchor.href = '';
        imgAnchor.classList.remove('active');
    }














    handleChangeInputFile(e: Event) {

        

        const imgElement = (((e.currentTarget as HTMLInputElement).parentElement as HTMLDivElement).parentElement?.getElementsByClassName('section-post-picture-insert-element-img')[0] as HTMLImageElement);

        const currentInputNumber = ((e.currentTarget as HTMLInputElement).id.replace('add-picture-input-file-', ''));
        const currentNameFile = `nameFile${currentInputNumber}`;



        imgElement.classList.remove('no-image');

        

        const fileReader = new FileReader();
        fileReader.onload = () => {
            imgElement.src = fileReader.result as string;
        }

        fileReader.readAsDataURL(((e.currentTarget as HTMLInputElement).files as FileList)[0]);


        (this.objectPost.picture as any)[currentInputNumber] = ((e.currentTarget as HTMLInputElement).files as FileList)[0];


        const url = URL.createObjectURL(((e.currentTarget as HTMLInputElement).files as FileList)[0]);

        const anchorElement = ((e.currentTarget as HTMLInputElement).parentElement?.parentElement?.getElementsByClassName('anchor-input-file')[0] as HTMLAnchorElement);

        anchorElement.href = url;

        anchorElement.classList.add('active');





        // loop to remove previous file IF PRESENT from array //


        if (this.objectNameFile[currentNameFile] !== '') {

            for (const key of Object.keys(this.objectPost.picture)) {



                if ((this.objectPost.picture as any)[key].name == this.objectNameFile[currentNameFile]) {
    


                    delete (this.objectPost.picture as any)[key];
    
                }
            }
        }



        /*---*/

        this.objectNameFile[currentNameFile] = (((e.currentTarget as HTMLInputElement).files as FileList)[0].name);

    }









    handleClickInputFile (e: Event) {

        const currentInputNumber = ((e.currentTarget as HTMLInputElement).id.replace('add-picture-input-file-', ''));
        const currentNameFile = `nameFile${currentInputNumber}`;

        if ((e.currentTarget as HTMLInputElement).value.replace('C:\\fakepath\\', '') !== '') {

            this.objectNameFile[currentNameFile] = (e.currentTarget as HTMLInputElement).value.replace('C:\\fakepath\\', '');
        }
    }












    handleClickBackSectionButton(e: MouseEvent) {

        e.preventDefault();

        if ((e.currentTarget as HTMLButtonElement).name.includes('overview')) {

            this.functionBackOverview();
        }

        const divSectionTitle = (document.getElementsByClassName('section-post-title-div')[0] as HTMLDivElement);
        const divSectionDescription = (document.getElementsByClassName('section-post-description-div')[0] as HTMLDivElement);
        const divSectionPicture = (document.getElementsByClassName('section-post-picture-div')[0] as HTMLDivElement);
        const divSectionOffer = (document.getElementsByClassName('section-post-offer-div')[0] as HTMLDivElement);

        if (((e.currentTarget as HTMLButtonElement).parentElement as HTMLDivElement).id == 'description') {

            this.functionAnimSection(divSectionDescription, divSectionTitle);
        }

        else if (((e.currentTarget as HTMLButtonElement).parentElement as HTMLDivElement).id == 'picture') {

            this.functionAnimSection(divSectionPicture, divSectionDescription);
        }

        else if (((e.currentTarget as HTMLButtonElement).parentElement as HTMLDivElement).id == 'offer') {

            this.functionAnimSection(divSectionOffer, divSectionPicture);
        }
    }











    functionBackOverview() {

        const divSectionTitle = (document.getElementsByClassName('section-post-title-div')[0] as HTMLDivElement);
        const divSectionDescription = (document.getElementsByClassName('section-post-description-div')[0] as HTMLDivElement);
        const divSectionPicture = (document.getElementsByClassName('section-post-picture-div')[0] as HTMLDivElement);
        const divSectionOffer = (document.getElementsByClassName('section-post-offer-div')[0] as HTMLDivElement);

        divSectionTitle.classList.remove('on');
        divSectionDescription.classList.remove('on');
        divSectionPicture.classList.remove('on');
        divSectionOffer.classList.remove('on');

        
        divSectionDescription.classList.add('off');
        divSectionPicture.classList.add('off');
        divSectionOffer.classList.add('off');

        divSectionTitle.classList.add('on');

        

        this.allActive = false;
    }














    functionAnimSection(firstSection: HTMLDivElement, secondSection: HTMLDivElement) {

        // set anim class and remove it to display none -> setTimeout delay = duration anim //

        firstSection.classList.remove('on');
        firstSection.classList.add('off-anim');

        setTimeout(() => {

            firstSection.classList.remove('off-anim');
            firstSection.classList.add('off');

        }, 300);





        // set on class to next div section element //

        setTimeout(() => {
            
            secondSection.classList.remove('off');
            secondSection.classList.add('on');
        }, 300);
    }














    handleSubmitRememberPost(e: Event) {

        e.preventDefault();



        if ((document.activeElement as HTMLButtonElement).value == 'no') {

            this.appService.newPostObject = Object.assign({}, {
                title: '',
                category_id: 0,
                description: '',
                city: '',
                zip: '',
                phone: '',
                email: '',
                delivery: false,
                offer: ''
            });


            this.appService.inputTitlePostDivClass_ContainsOn_NotAllActive_NewPostObjectTitleLengthMoreThanZero = false;

            this.disableEnableButtonTitle('enable');
        }







        else if ((document.activeElement as HTMLButtonElement).value == 'yes') {

            const sectionRememberPost = (document.getElementsByClassName('section-remember-post')[0] as HTMLElement);

            sectionRememberPost.style.display = 'none'

            this.disableEnableButtonTitle('enable');

            const inputTitle = (document.getElementsByClassName('section-post-title-input')[0] as HTMLInputElement);
            const selectCategory = (document.getElementsByClassName('section-post-title-select-category')[0] as any);
            const textareaDescription = (document.getElementsByClassName('section-post-description-textarea')[0] as HTMLTextAreaElement);

            const cityInputDescription = (document.getElementsByClassName('section-post-description-city-input')[0] as HTMLInputElement);
            const zipInputDescription = (document.getElementsByClassName('section-post-description-zip-input')[0] as HTMLInputElement);
            const phoneInputDescription = (document.getElementsByClassName('section-post-description-phone-input')[0] as HTMLInputElement);
            const emailInputDescription = (document.getElementsByClassName('section-post-description-email-input')[0] as HTMLInputElement);

            const inputRadio = (document.getElementsByClassName('section-post-description-delivery') as HTMLCollectionOf<HTMLInputElement>);

            const inputOffer = (document.getElementsByClassName('section-post-offer-input')[0] as HTMLInputElement);






            inputTitle.value = this.appService.newPostObject.title;
            
            for (let i = 0; i < selectCategory.length; i++) {

                if (Number(selectCategory.options[i].value) == Number(this.appService.newPostObject.category_id)) {

                    selectCategory.options[i].selected = true;
                    break;
                }
            }

            textareaDescription.value = this.appService.newPostObject.description;
            cityInputDescription.value = this.appService.newPostObject.city;
            zipInputDescription.value = this.appService.newPostObject.zip;
            phoneInputDescription.value = this.appService.newPostObject.phone;
            emailInputDescription.value = this.appService.newPostObject.email;
            inputOffer.value = this.appService.newPostObject.offer;
            

            for (let i = 0; i < inputRadio.length; i++) {

                if (this.appService.newPostObject.delivery == true) {

                    if (inputRadio[i].id.includes('delivery-yes')) {

                        inputRadio[i].checked = true;
                        break;
                    }
                }


                else if (this.appService.newPostObject.delivery == false) {

                    if (inputRadio[i].id.includes('delivery-no')) {

                        inputRadio[i].checked = true;
                        break;
                    }
                }
            }
        }
    }








    disableEnableButtonTitle(status: string) {

        const buttonNextPost = (document.getElementsByClassName('button-post-title') as HTMLCollectionOf<HTMLButtonElement>);

        for (let i = 0; i < buttonNextPost.length; i++) {
            
            if (buttonNextPost[i].name == 'button-post-title') {

                if (status == 'enable') {

                    buttonNextPost[i].style.pointerEvents = 'auto';
                }

                else if (status == 'disable') {

                    buttonNextPost[i].style.pointerEvents = 'none';
                }
            }
        }

    }
}
