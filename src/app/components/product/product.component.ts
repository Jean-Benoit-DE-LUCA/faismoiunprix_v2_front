import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '../../app.service';

import Map from 'ol/Map.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

import {useGeographic} from 'ol/proj.js';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

interface ProductDataInterface {
    0: {
        product: {
            product_city: string,
            product_created_at: string,
            product_delivery: string,
            product_description: string,
            product_id: number,
            product_latitude: string,
            product_longitude: string,
            product_name: string,
            product_updated_at: string,
            product_user_id: number
        }
    }
}

interface OfferInterface {
    offer_created_at: string;
    offer_id: number;
    offer_offerprice: string;
    offer_product_id: number;
    offer_status: string;
    offer_updated_at: string;
    offer_user_offer: number;
    user_offer_email: string;
    user_offer_firstname: string;
    user_offer_name: string;
}

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})

export class ProductComponent {

    productId = '';

    productData: any = {};

    map: Map | null = null;

    offerAccepted: OfferInterface = {
        offer_created_at: '',
        offer_id: 0,
        offer_offerprice: '',
        offer_product_id: 0,
        offer_status: '',
        offer_updated_at: '',
        offer_user_offer: 0,
        user_offer_email: '',
        user_offer_firstname: '',
        user_offer_name: ''
    };

    constructor(private router: Router, public appService: AppService) {

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });



        




        this.appService.manageInterval();

        this.productId = window.location.pathname.replace('/product/', '');
        
        this.getProductById(this.productId);

        this.appService.lengthSpanTitleFunction();





        // get products by user id //

        this.waitForProductUserIdLoad();

        //this.appService.getOtherProductArrayUserResult(this.productData[0].product.product_user_id);
    }





    // wait for productData load //

    async waitForProductUserIdLoad() {

        const userIdPromise = new Promise(resolve => {

            if (this.productData[0] !== undefined) {

                resolve(this.productData[0].product.product_user_id);
                
                this.appService.getOtherProductArrayUserResult(this.productData[0].product.product_user_id);
            }


            else if (this.productData[0] == undefined) {

                setTimeout(() => {

                    this.waitForProductUserIdLoad();
                }, 125);
            }
        });




        const responseUserIdPromise = await userIdPromise;
    }



    

    // map //

    setGeographic(productData: any) {

        useGeographic();
            
        const place = [productData[0]['product']['product_longitude'], productData[0]['product']['product_latitude']];

        const point = new Point(place);

        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                source: new OSM(),
                }),
                new VectorLayer({
                source: new VectorSource({
                    features: [new Feature(point)]
                }),
                style: {
                    'circle-radius': 5,
                    'circle-fill-color': '#ef3737'
                },
                }),
            ],
            view: new View({
                center: place,
                zoom: 5,
            }),
        });
    }





    async getProductById(productId: string) {

        const response = await fetch(`${this.appService.hostname}/api/getproductbyid/${productId}`, {
            method: 'GET'
        });

        const responseData = await response.json();

        this.productData = Object.assign({}, responseData.result);


        this.setGeographic(this.productData);




        // sort offer array by created_at (last oldest) //

        this.productData[0]['offer'] = this.productData[0]['offer'].slice().sort((a: any, b: any) => {

            if (a.offer_created_at < b.offer_created_at) {

                return 1;
            }

            else if (a.offer_created_at > b.offer_created_at) {

                return -1;
            }

            return 0;
        });

        this.checkAcceptedOffer(this.productData[0]['offer']);




        // get expire time product //

        if (this.appService.intervalExpireProduct !== null) {

            clearInterval(this.appService.intervalExpireProduct);

            this.appService.intervalExpireProduct = null;
        }

        
        this.appService.intervalExpireProduct = setInterval(() => {
            this.appService.getRemainingTimeProduct(this.productData[0].product.product_created_at);
        }, 1000);
    }






    /*--- CHECK IF ACCECPTED OFFER ---*/

    checkAcceptedOffer(arrayOffer: Array<any>) {


        for (let i = 0; i < arrayOffer.length; i++) {

            if (arrayOffer[i].offer_status == 'accepted') {

                this.offerAccepted = arrayOffer[i];
                break;
            }
        }
    }




    /*--- CHECK IF OFFERACCEPTED PROPERTY => OBJECT ---*/

    isValidObjectOffer(property: any) {


        if (property.offer_id !== 0) {
            return true;
        }

        else {
            return false;
        }
    }










    /*--- CLICK ARROW CAROUSEL ---*/

    handleClickArrowCarousel(direction: string) {

        const minWidth700 = window.matchMedia('(min-width: 700px)');

        const carouselDiv = (document.getElementsByClassName('section-product-carousel')[0] as HTMLDivElement);


        const photoArray = this.productData[0].photo.photo_photo_list.split(',');

        


        

        // if NEXT arrow //

        if (direction == 'next' && (photoArray.length > 1 && photoArray.length == 3)) {



            if (minWidth700.matches == false) {

                if (Number(carouselDiv.style.marginLeft.replace('vw', '')) > -100) {

                    carouselDiv.style.marginLeft = '-100vw';
                }

                else if (Number(carouselDiv.style.marginLeft.replace('vw', '')) == -100) {

                    carouselDiv.style.marginLeft = '-200vw';
                }
            }




            else if (minWidth700.matches == true) {

                if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == 0) {

                    carouselDiv.style.marginLeft = '-31.25rem';
                }

                else if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == -31.25) {

                    carouselDiv.style.marginLeft = '-62.50rem';
                }
            }


        }


        else if (direction == 'next' && (photoArray.length > 1 && photoArray.length == 2)) {



            if (minWidth700.matches == false) {

                if (Number(carouselDiv.style.marginLeft.replace('vw', '')) > -100) {

                    carouselDiv.style.marginLeft = '-100vw';
                }
            }




            else if (minWidth700.matches == true) {

                if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == 0) {

                    carouselDiv.style.marginLeft = '-31.25rem';
                }
            }


        }







        // if PREV arrow //

        else if (direction == 'prev' && (photoArray.length > 1 && photoArray.length == 3)) {



            if (minWidth700.matches == false) {

                if (Number(carouselDiv.style.marginLeft.replace('vw', '')) == -200) {

                    carouselDiv.style.marginLeft = '-100vw';
                }

                else if (Number(carouselDiv.style.marginLeft.replace('vw', '')) == -100) {

                    carouselDiv.style.marginLeft = '0vw';
                }
            }



            

            else if (minWidth700.matches == true) {

                if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == -62.50) {

                    carouselDiv.style.marginLeft = '-31.25rem';
                }

                else if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == -31.25) {

                    carouselDiv.style.marginLeft = '0rem';
                }
            }
        }


        else if (direction == 'prev' && (photoArray.length > 1 && photoArray.length == 2)) {



            if (minWidth700.matches == false) {


                if (Number(carouselDiv.style.marginLeft.replace('vw', '')) == -100) {

                    carouselDiv.style.marginLeft = '0vw';
                }
            }



            

            else if (minWidth700.matches == true) {


                if (Number(carouselDiv.style.marginLeft.replace('rem', '')) == -31.25) {

                    carouselDiv.style.marginLeft = '0rem';
                }
            }
        }

    }











    /*--- CLICK PHONE BUTTON ---*/

    handleClickPhoneButton(e: MouseEvent) {

        e.preventDefault();

        const maxWidth900 = window.matchMedia('(max-width: 900px)');


        // > 900px //

        if (maxWidth900.matches == false) {

            const spanPhoneString = (document.getElementsByClassName('section-search-result-element-div-product-owner-button-phone-span')[0] as HTMLSpanElement);

            const spanPhoneNumber = (document.getElementsByClassName('section-search-result-element-div-product-owner-button-phone-span-phone')[0] as HTMLSpanElement);


            spanPhoneString.classList.add('active');
            spanPhoneNumber.classList.add('active');
        }




        // < 900px //

        else if (maxWidth900.matches == true) {

            const spanPhoneString = (document.getElementsByClassName('section-search-result-element-div-product-owner-button-phone-span')[1] as HTMLSpanElement);

            const spanPhoneNumber = (document.getElementsByClassName('section-search-result-element-div-product-owner-button-phone-span-phone')[1] as HTMLSpanElement);



            spanPhoneString.classList.add('active');
            spanPhoneNumber.classList.add('active');
        }        
    }














    /*--- SUBMIT OFFER ---*/

    handleSubmitOffer(e: SubmitEvent) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const inputOffer = (document.getElementsByClassName('section-search-result-element-make-offer-div-input')[0] as HTMLInputElement);



        if (inputOffer.value.trim().length == 0) {



            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });



            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'Veuillez saisir un nombre valide';
                errorDiv.classList.add('active_error');
            }, 500);



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');
            }, 3500);
        }






        else if (this.productData[0].product.product_user_id == this.appService.user.id) {


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });



            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'Vous ne pouvez pas émettre une offre pour votre produit';
                errorDiv.classList.add('active_error');
            }, 500);



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');
            }, 3500);
        }




        else if (inputOffer.value.trim() !== '') {


            if (this.productData[0].offer[this.productData[0].offer.length - 1].offer_offerprice !== null) {


                if (parseFloat(inputOffer.value.trim()) < parseFloat(this.productData[0].offer[this.productData[0].offer.length - 1].offer_offerprice)) {

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
        
        
        
                    this.appService.timeoutRoute = setTimeout(() => {
        
                        errorDivSpan.textContent = `L'offre est trop basse par rapport au minimum requis: ${this.productData[0].offer[this.productData[0].offer.length - 1].offer_offerprice} €`;
                        errorDiv.classList.add('active_error');
                    }, 500);
        
        
        
                    this.appService.timeoutRoute = setTimeout(() => {
        
                        errorDiv.classList.remove('active_error');
                    }, 3500);
                }





                else if (parseFloat(inputOffer.value.trim()) >= parseFloat(this.productData[0].offer[this.productData[0].offer.length - 1].offer_offerprice)) {

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
        
        
        
                    this.appService.timeoutRoute = setTimeout(() => {
        
                        errorDivSpan.textContent = `Confirmer l\'offre de ${inputOffer.value.trim()}€ ?`;
                        errorConfirmDiv.classList.add('active_confirm');
                        errorDiv.classList.add('active_confirm');
                        mainElement.classList.add('blur');
                    }, 750);

                }

            }






            else if (this.productData[0].offer[this.productData[0].offer.length - 1].offer_offerprice == null) {

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
    
    
    
                this.appService.timeoutRoute = setTimeout(() => {
    
                    errorDivSpan.textContent = `Confirmer l\'offre de ${inputOffer.value.trim()}€ ?`;
                    errorConfirmDiv.classList.add('active_confirm');
                    errorDiv.classList.add('active_confirm');
                    mainElement.classList.add('blur');
                }, 750);

            }

        }
    }












    /*--- CLICK MESSAGE BUTTON ---*/

    handleClickMessageButton(e: MouseEvent) {

        e.preventDefault();
        
        const sectionMessage = (document.getElementsByClassName('section-myoffer-section-specific-offer')[0] as HTMLElement);

        sectionMessage.classList.add('active');
    }







    /*--- CLICK CROSS MESSAGE ---*/

    handleClickCrossOffer(e: MouseEvent) {

        const specificOffer = (document.getElementsByClassName('section-myoffer-section-specific-offer')[0] as HTMLElement);

        specificOffer.classList.remove('active');
    }












    /*--- CICK SEND MESSAGE BUTTON ---*/

    async handleClickSendMessage(e: MouseEvent) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const crossFilter = (document.getElementsByClassName('cross-filter-offer')[0] as HTMLButtonElement);



        const textareaContactMessage = (document.getElementsByClassName('product-textarea-contact')[0] as HTMLTextAreaElement);



        if (this.appService.user.jwt.length == 0) {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });



            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = ' pour émettre un message';
                errorDiv.classList.add('active_error');
            }, 500);



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');
            }, 3500);
        }

        else if (textareaContactMessage.value.trim().length == 0) {

            textareaContactMessage.style.outlineColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            textareaContactMessage.focus();
        }

        else if (textareaContactMessage.value.trim().length > 0) {

            const response = await fetch(`${this.appService.hostname}/api/insertmessagecontact`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.appService.user.jwt}`
                },
                body: JSON.stringify({
                    user_product_id: this.productData[0]['product']['product_user_id'],
                    user_send_id: this.appService.user.id,
                    user_receive_id: this.productData[0]['product']['product_user_id'],
                    product_id: this.productData[0]['product']['product_id'],
                    message: textareaContactMessage.value.trim()
                })
            });

            const responseData = await response.json();






            if (!responseData.flag) {

                if (responseData.message.startsWith('Expired token')) {

                    this.appService.timeoutRoute = setTimeout(() => {

                    errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';

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






            else if (responseData.flag) {

                crossFilter.click();

                textareaContactMessage.value = '';

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                errorDivSpan.textContent = 'Message envoyé avec succès';

                errorDiv.classList.add('active_success');



                this.appService.timeoutRoute = setTimeout(() => {

                    errorDiv.classList.remove('active_success');

                }, 2500);



            }

        }
    }

}
