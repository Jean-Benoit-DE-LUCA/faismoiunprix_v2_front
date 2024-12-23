import { Component } from '@angular/core';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PostData } from '../../post/post.component';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
    selector: 'app-productedit',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './productedit.component.html',
    styleUrl: './productedit.component.css'
})

export class ProducteditComponent {

    product_id: string = '';

    productData: any = {};




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

    constructor(public appService: AppService, private router: Router) {

        this.appService.inactiveLoader();

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });






        this.appService.manageInterval();

        this.product_id = window.location.pathname.replace('/myaccount/product/edit/', '');
        
        this.getProductById(this.product_id);
    }






    async getProductById(productId: string) {

        const response = await fetch(`${this.appService.hostname}/api/getproductbyid/${productId}`, {
            method: 'GET'
        });

        const responseData = await response.json();


        let sortOffer = responseData.result[0].offer.sort((a: any, b: any) => {

            if (a.offer_created_at < b.offer_created_at) {
                return 1;
            }

            else if (a.offer_created_at > b.offer_created_at) {
                return -1;
            }
            
            return 0;
        });






        this.productData = Object.assign({}, responseData.result);

        console.log(this.productData);




        if (responseData.result[0].photo.photo_photo_list !== null) {

            for (let i = 0; i < responseData.result[0].photo.photo_photo_list.split(',').length; i++) {

                let nameFile = `nameFile${i+1}`;

                this.objectNameFile[nameFile] = responseData.result[0].photo.photo_photo_list.split(',')[i];
            }
        }




        // get expire time product //

        if (this.appService.intervalExpireProduct !== null) {

            clearInterval(this.appService.intervalExpireProduct);

            this.appService.intervalExpireProduct = null;
        }

        this.appService.intervalExpireProduct = setInterval(() => {
            this.appService.getRemainingTimeProduct(this.productData[0].product.product_created_at);
        }, 1000);
        

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
        
        console.log(this.objectNameFile);

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


        console.log(this.objectNameFile);
        console.log(this.objectPost);
    }











    handleClickInputFile (e: Event) {

        const currentInputNumber = ((e.currentTarget as HTMLInputElement).id.replace('add-picture-input-file-', ''));
        const currentNameFile = `nameFile${currentInputNumber}`;

        if ((e.currentTarget as HTMLInputElement).value.replace('C:\\fakepath\\', '') !== '') {

            this.objectNameFile[currentNameFile] = (e.currentTarget as HTMLInputElement).value.replace('C:\\fakepath\\', '');
        }
    }














    updateProduct(e: SubmitEvent) {

        e.preventDefault();


        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);


        const inputTitle = (document.getElementsByClassName('section-post-title-input')[0] as HTMLInputElement);
        const selectCategory = (document.getElementsByClassName('section-post-title-select-category')[0] as HTMLSelectElement);

        
        if (inputTitle.value.length >= 4 && selectCategory.value !== '-') {

            this.objectPost.title = inputTitle.value;
            this.objectPost.category_id = Number(selectCategory.value);
        }

        else if (inputTitle.value.length < 4) {

            inputTitle.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            inputTitle.focus();

            return;
        }

        else if (selectCategory.value == '-') {

            selectCategory.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            selectCategory.focus();

            return;
        }






        const textareaDescription = (document.getElementsByClassName('section-post-description-textarea')[0] as HTMLTextAreaElement);
        const cityInputDescription = (document.getElementsByClassName('section-post-description-city-input')[0] as HTMLInputElement);
        const zipInputDescription = (document.getElementsByClassName('section-post-description-zip-input')[0] as HTMLInputElement);
        const phoneInputDescription = (document.getElementsByClassName('section-post-description-phone-input')[0] as HTMLInputElement);
        const emailInputDescription = (document.getElementsByClassName('section-post-description-email-input')[0] as HTMLInputElement);
        const inputRadio = (document.getElementsByClassName('section-post-description-delivery') as HTMLCollectionOf<HTMLInputElement>);
        const inputOffer = (document.getElementsByClassName('section-post-offer-input')[0] as HTMLInputElement);


        if (cityInputDescription.value.trim().length > 0 && zipInputDescription.value.trim().length > 0 && phoneInputDescription.value.trim().length > 0 && emailInputDescription.value.trim().length > 0 && (emailInputDescription.value.trim().includes('@') && emailInputDescription.value.trim().includes('.'))) {

            this.objectPost.description = textareaDescription.value;
            this.objectPost.city = cityInputDescription.value.trim();
            this.objectPost.zip = zipInputDescription.value.trim();
            this.objectPost.phone = phoneInputDescription.value.trim();
            this.objectPost.email = emailInputDescription.value.trim();

            
            for (let i = 0; i < inputRadio.length; i++) {

                if (inputRadio[i].checked) {

                    if (inputRadio[i].id.includes('delivery-yes')) {

                        this.objectPost.delivery = true;
                    }

                    else if (inputRadio[i].id.includes('delivery-no')) {

                        this.objectPost.delivery = false;
                    }
                }
            }
        }

        else if (cityInputDescription.value.trim().length == 0) {

            cityInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            cityInputDescription.focus();

            return;
        }

        else if (zipInputDescription.value.trim().length == 0) {

            zipInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            zipInputDescription.focus();

            return;
        }

        else if (phoneInputDescription.value.trim().length == 0) {

            phoneInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            phoneInputDescription.focus();

            return;
        }

        else if (emailInputDescription.value.trim().length == 0 || !emailInputDescription.value.trim().includes('@') || !emailInputDescription.value.trim().includes('.')) {

            emailInputDescription.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            emailInputDescription.focus();

            return;
        }








        if (!isNaN(Number(inputOffer.value.trim()))) {

            this.objectPost.offer = inputOffer.value.trim();
        }

        else if (isNaN(Number(inputOffer.value.trim()))) {

            (inputOffer.parentElement as HTMLDivElement).style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            inputOffer.focus();

            return;
        }








        // if user logged in //

        if (this.appService.user.id > 0) {

            this.objectPost['user_id'] = this.appService.user.id;

            this.appService.newPostObject = Object.assign({}, this.objectPost);
            this.appService.objectNameFileUpdate = Object.assign({}, this.objectNameFile);




            errorDiv.classList.remove('active_error');

            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'On confirme la modification ?';
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


        console.log(this.objectPost);
    }







    handleSubmitDeleteProduct(e: SubmitEvent) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);



        const product_id = window.location.pathname.replace('/myaccount/product/edit/', '');



        // if user logged in //

        if (this.appService.user.id > 0) {




            errorDiv.classList.remove('active_error');

            const spanHidden = document.createElement('span');
            spanHidden.setAttribute('class', 'error-div-span-hidden');
            spanHidden.setAttribute('data-product-id-delete', product_id);

            errorDiv.append(spanHidden);

            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'On confirme la suppression ? Attention, cela supprimera tous les offres et messages liés à ce produit';
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
















    async handleClickRenewSeeButton(e: Event) {



        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        let buttonValue = (e.target as HTMLButtonElement).value;

        let buttonIdProduct =(e.target as HTMLButtonElement).getAttribute('data-id-product');




    




        // if button clicked == RENEW //

        if (buttonValue == 'renew') {




            // // if user logged in //

            if (this.appService.user.id > 0) {



                if (buttonIdProduct == window.location.pathname.replace('/myaccount/product/edit/', '')) {



                    errorDiv.classList.remove('active_error');

                    const spanHidden = document.createElement('span');
                    spanHidden.setAttribute('class', 'error-div-span-hidden');
                    spanHidden.setAttribute('data-product-id-renew', buttonIdProduct as string);


                    errorDiv.append(spanHidden);

                    
                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDivSpan.textContent = 'Êtes-vous sûr de vouloir renouveller l\'annonce pour 14 jours supplémentaires ?';
                        errorConfirmDiv.classList.add('active_confirm');
                        errorDiv.classList.add('active_confirm');
                        mainElement.classList.add('blur');
                    }, 750);

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
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













        // if button clicked == SEE-OFFER //

        else if (buttonValue == 'see-offer') {

            this.router.navigate([`/myoffer`], {
                'queryParams': {
                    'see': buttonIdProduct
                }
            });


            let buttonReceived = (document.getElementsByClassName('section-my-offer-button-received')[0] as HTMLButtonElement);;


            const promiseButtonReceived = new Promise(resolve => {

                


                if (buttonReceived == undefined) {

                    setTimeout(() => {

                        this.handleClickRenewSeeButton(e);
                    }, 25);
                }



                else if (buttonReceived !== undefined) {

                    resolve(buttonReceived);
                }
            });


            const resultPromiseButtonReceived = await promiseButtonReceived;

           
            if (resultPromiseButtonReceived !== undefined) {




                // set attribute to filter only offer product_id offers //

                buttonReceived.setAttribute('specific_product_id', (buttonIdProduct as string));

                buttonReceived.click();
            }
        }
    }
}
