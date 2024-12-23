import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';

import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-myoffer',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './myoffer.component.html',
    styleUrl: './myoffer.component.css'
})

export class MyofferComponent {

    offerResult: Array<any> = [];

    // offerSpecific: Array<any> = [];

    offerSpecificMessage: Array<any> = [];





    constructor(private router: Router, private route: ActivatedRoute, public appService: AppService) {

        this.route.queryParamMap.subscribe(params => {

            const idProduct = params.get('see');
        });

        this.appService.manageInterval();
    }






    async getOffer(e: Event, received_sent: string) {


        setTimeout(() => {

            const tableResult = (document.getElementsByClassName('table-myoffer-result')[0] as HTMLTableElement);


            window.scrollTo({
                top: tableResult.offsetTop + 100,
                behavior: 'smooth'
            });
        }, 125);




        await this.appService.checkCookie();


        if (received_sent == 'received') {




            // if specific product_id is set from product edit page to see offers //

            const specificProductId = (e.target as HTMLButtonElement).getAttribute('specific_product_id');




            if (specificProductId !== null) {

                this.manageOffer(await this.getReceivedOfferByUser(this.appService.user.id), Number(specificProductId));

                (e.target as HTMLButtonElement).removeAttribute('specific_product_id');
            }

            else if (specificProductId == null) {

                this.manageOffer(await this.getReceivedOfferByUser(this.appService.user.id));
            }
        }


        else if (received_sent == 'sent') {

            this.manageOffer(await this.getSentOfferByUser(this.appService.user.id));
        }
        
    }



    async getReceivedOfferByUser(user_id: number) {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const response = await fetch(`${this.appService.hostname}/api/getreceivedofferbyuser/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.appService.user.jwt}`
            }
        });

        const responseData = await response.json();

        

        if (responseData.flag) {

            return responseData.result;
        }



        else if (!responseData.flag) {

            if (responseData.message.startsWith('Expired token')) {

                

                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');





                this.appService.timeoutRoute = setTimeout(() => {

                    errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
                    errorDiv.classList.add('active_error');

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                }, 1000);
            }

            return [];
        }
    }







    async getSentOfferByUser(user_id: number) {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);



        const response = await fetch(`${this.appService.hostname}/api/getsentofferbyuser/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.appService.user.jwt}`
            }
        });

        const responseData = await response.json();

        
        
        if (responseData.flag) {

            return responseData.result;
        }



        else if (!responseData.flag) {

            if (responseData.message.startsWith('Expired token')) {



                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');





                this.appService.timeoutRoute = setTimeout(() => {

                    errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
                    errorDiv.classList.add('active_error');

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                }, 1000);
            }

            return [];
        }
    }









    manageOffer(array_result: Array<any>, specific_product_id: number | null = null) {

        this.offerResult = array_result.slice();

        console.log(specific_product_id);






        if (specific_product_id !== null) {

            this.offerResult = this.offerResult.filter((element) => element.offer_product_id == specific_product_id);
        }




        if (this.offerResult.length > 0) {

            const positionFirstTitleRow = (document.getElementsByClassName('table-myoffer-result-tbody-tr-table-tr') as HTMLCollectionOf<HTMLTableRowElement>);

            setTimeout(() => {
                positionFirstTitleRow[0].style.top = '-.85rem';
            }, 25);
        }

    }












    async handleClickRowOffer(e: MouseEvent) {

        const rowOffersImageEnvelope = (e.currentTarget as HTMLTableRowElement).getElementsByClassName('img-envelope offer')[0];




        const offerId = ((e.currentTarget as HTMLTableRowElement).getAttribute('data-offer-id'));

        const offerData = this.offerResult.filter( elem => elem.offer_id == offerId);

        this.appService.offerSpecific = offerData.slice();





        const specificOffer = (document.getElementsByClassName('section-myoffer-section-specific-offer')[0] as HTMLElement);

        specificOffer.classList.add('active');




        console.log(this.appService.offerSpecific[0]);



        // update user_receive_id_read on click //

        const responseUpdateReceiveRead = await fetch(`${this.appService.hostname}/api/updatemessagereceiveread`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.appService.user.jwt}`
            },
            body: JSON.stringify({
                offerId: offerId,
                userId: this.appService.user.id
            })
        });

        const responseUpdateReceiveReadData = await responseUpdateReceiveRead.json();

        console.log(responseUpdateReceiveReadData);

        if (responseUpdateReceiveReadData.flag) {

            if (responseUpdateReceiveReadData.hasOwnProperty('messageReadStillFalse')) {

                if (!responseUpdateReceiveReadData.messageReadStillFalse) {

                    this.appService.offerSpecific[0].message_not_read = false;




                    if (rowOffersImageEnvelope.classList.contains('active')) {

                        rowOffersImageEnvelope.classList.remove('active');
                    }

                    // TODO => CONTACT => NOT HERE //
                }
            }




            if (responseUpdateReceiveReadData.hasOwnProperty('messageNotRead')) {

                if (!responseUpdateReceiveReadData.messageNotRead) {

                    this.appService.messageNotRead = 'false';

                    document.cookie = `messageNotReadGiveDiscount=${this.appService.messageNotRead};path=/`;
                }
            }
        }

        //





        
        this.getMessageByOffer(this.appService.offerSpecific[0]['offer_id'], this.appService.offerSpecific[0]['product_user_id'], this.appService.offerSpecific[0]['offer_user_offer']);

        this.appService.intervalFetchMessage = setInterval(() => {

            this.updateMessageByOffer(this.appService.offerSpecific[0]['offer_id'], this.appService.offerSpecific[0]['product_user_id'], this.appService.offerSpecific[0]['offer_user_offer']);
        }, 10000);
    }





    async updateMessageByOffer(offer_id: number, user_id: number, user_offer_id: number) {

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

        const currentMessageDiv = (divMessaging.getElementsByClassName('specific-offer-div-messaging-div-wrap') as HTMLCollectionOf<HTMLDivElement>);

        console.log(currentMessageDiv.length);

        const spanMessageId = (document.getElementsByClassName('specific-offer-div-messaging-span-message-id-hidden') as HTMLCollectionOf<HTMLSpanElement>);





        const response = await fetch(`${this.appService.hostname}/api/getmessagebyoffer`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.appService.user.jwt}`
            },
            body: JSON.stringify({
                offerId: offer_id,
                userId: user_id,
                userOfferId: user_offer_id
            })
        });

        const responseData = await response.json();




        if (responseData.flag) {



            // check if current div message length == current message length database //

            if (currentMessageDiv.length < responseData.result.length) {




                // get current message id within div //

                const arrayCurrentMessageId = [];

                for (let i = 0; i < spanMessageId.length; i++) {
                    arrayCurrentMessageId.push(Number(spanMessageId[i].getAttribute('data-message-id')));
                }

                arrayCurrentMessageId.sort((a, b) => a - b);

                console.log(arrayCurrentMessageId);




                // get actual message id in database //

                const arrayActualMessageId = [];

                for (let i = 0; i < responseData.result.length; i++) {
                    arrayActualMessageId.push(Number(responseData.result[i].message_id));
                }

                arrayActualMessageId.sort((a, b) => a - b);

                console.log(arrayActualMessageId);





                // check if div user message is synchronized with database //

                for (let i = 0; i < arrayActualMessageId.length; i++) {

                    let isIn = false;

                    for (let y = 0; y < arrayCurrentMessageId.length; y++) {

                        if (arrayActualMessageId[i] == arrayCurrentMessageId[y]) {

                            isIn = true;
                            break;
                        }
                    }


                    if (isIn == false) {

                        let messageIdToInsert = arrayActualMessageId[i];
                        
                        for (let z = 0; z < responseData.result.length; z++) {

                            if (responseData.result[z].message_id == messageIdToInsert) {




                                while (currentMessageDiv.length !== 0) {

                                    for (let i = 0; i < currentMessageDiv.length; i++) {

                                        currentMessageDiv[i].remove();
                                    }
                                }




                                this.offerSpecificMessage = responseData.result.slice();


                                window.setTimeout(() => {

                                    for (let r = 0; r < currentMessageDiv.length; r++) {

                                        if (Number(currentMessageDiv[r].getElementsByClassName("specific-offer-div-messaging-span-message-id-hidden")[0].getAttribute("data-message-id")) !== messageIdToInsert) {
                                            currentMessageDiv[r].style.animation = "none";
                                            currentMessageDiv[r].style.opacity = "1";
                                            currentMessageDiv[r].style.transform = "translateX(0)";
                                        }
                                    }

                                    divMessaging.scrollTop = divMessaging.scrollHeight;

                                }, 5);
                            }
                        }
                    }
                }
            }
        }




        else if (!responseData.flag) {

            if (responseData.hasOwnProperty('message')) {

                if (responseData.message.startsWith('Expired token')) {




                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
    
                        errorDiv.classList.add('active_error');
    
                        }, 750);
            
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
    
    
    
                        // this.appService.timeoutRoute = window.setTimeout(() => {
    
                        //     errorDiv.classList.remove('active_error');
                        // }, 5000);
                }
            }
        }
    }





    












    handleClickCrossOffer(e: MouseEvent) {

        const specificOffer = (document.getElementsByClassName('section-myoffer-section-specific-offer')[0] as HTMLElement);

        specificOffer.classList.remove('active');

        if (this.appService.intervalFetchMessage !== null) {

            clearInterval(this.appService.intervalFetchMessage);
        }
    }











    async handleSubmitMessage(e: SubmitEvent) {

        e.preventDefault();

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const inputMessage = (document.getElementsByClassName('specific-offer-input-messaging')[0] as HTMLInputElement);




        if (inputMessage.value.trim() == '') {

            inputMessage.placeholder = 'Tapez votre texte';
            inputMessage.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            inputMessage.focus();
        }



        else {

            console.log(this.appService.user.id);
            console.log(this.appService.offerSpecific[0]['offer_user_offer']);
            console.log(this.appService.offerSpecific[0]['product_id']);
            console.log(inputMessage.value);

            console.log(this.appService.user);





            const response = await fetch(`${this.appService.hostname}/api/insertmessage`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.appService.user.jwt}`
                },
                body: JSON.stringify({
                    userId: this.appService.user.id,
                    productUserId: this.appService.offerSpecific[0]['product_user_id'],
                    userIdOffer: this.appService.offerSpecific[0]['offer_user_offer'],
                    offerId: this.appService.offerSpecific[0]['offer_id'],
                    productId: this.appService.offerSpecific[0]['product_id'],
                    inputMessage: inputMessage.value
                })
            });


            const responseData = await response.json();

            console.log(responseData);








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


                this.appService.createMessage(this.appService.user.firstname, inputMessage.value, this.appService.getCurrentDateTime(), responseData.lastMessageInserted[0].message_id.toString());


                inputMessage.value = '';
                inputMessage.focus();
            }

        }
    }








    async getMessageByOffer(offer_id: number, user_id: number, user_offer_id: number) {

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);



        const response = await fetch(`${this.appService.hostname}/api/getmessagebyoffer`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.appService.user.jwt}`
            },
            body: JSON.stringify({
                offerId: offer_id,
                userId: user_id,
                userOfferId: user_offer_id
            })
        });

        const responseData = await response.json();

        console.log(responseData.result);



        if (responseData.flag) {

            this.waitElementRemoveMessageBeforeInsert(responseData.result.slice());

            this.waitElementScrollDiv();
        }




        else if (!responseData.flag) {

            if (responseData.hasOwnProperty('message')) {

                if (responseData.message.startsWith('Expired token')) {




                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
    
                        errorDiv.classList.add('active_error');
    
                        }, 750);
            
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
    
    
    
                        // this.appService.timeoutRoute = window.setTimeout(() => {
    
                        //     errorDiv.classList.remove('active_error');
                        // }, 5000);
                }
            }
        }
    }




    async waitElementRemoveMessageBeforeInsert(array: Array<any>) {

        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

        const waitPromiseElement =  new Promise(resolve => {

            if (divMessaging !== undefined) {


                setTimeout(() => {

                    const currentMessageDiv = (divMessaging.getElementsByClassName('specific-offer-div-messaging-div-wrap') as HTMLCollectionOf<HTMLDivElement>);


                    while (currentMessageDiv.length !== 0) {

                        for (let i = 0; i < currentMessageDiv.length; i++) {

                            currentMessageDiv[i].remove();
                        }
                    }



                }, 400);




                setTimeout(() => {

                    this.offerSpecificMessage = array;
                }, 500);
                
            }
        });
    }




    async waitElementScrollDiv() {

        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

        const waitPromiseElement =  new Promise(resolve => {

            if (divMessaging !== undefined) {

                setTimeout(() => {

                    divMessaging.scrollTop = divMessaging.scrollHeight;
                }, 500);
                
            }
        });
    }























    handleClickAcceptDenyOffer(e: MouseEvent, status: string) {

        console.log(this.appService.offerSpecific[0]['user_offer_firstname']);

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);





        if (status == 'accepted') {


            this.appService.timeoutRoute = setTimeout(() => {

                const spanHidden = document.createElement('span');
                spanHidden.setAttribute('class', 'error-div-span-hidden');
                spanHidden.setAttribute('data-offer-id', this.appService.offerSpecific[0]['offer_id']);
                spanHidden.setAttribute('data-offer-response', 'accepted');

                errorDiv.append(spanHidden);



                errorDiv.classList.remove('active_error');


                errorDivSpan.textContent = `Êtes-vous sur d\'accepter l\'offre de ${this.appService.offerSpecific[0]['user_offer_firstname']} de ${this.appService.offerSpecific[0]['offer_offerprice']} €`;
                errorConfirmDiv.classList.add('active_confirm');
                errorDiv.classList.add('active_confirm');
                mainElement.classList.add('blur');
            }, 750);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        


        }




        else if (status == 'denied') {


            this.appService.timeoutRoute = setTimeout(() => {

                const spanHidden = document.createElement('span');
                spanHidden.setAttribute('class', 'error-div-span-hidden');
                spanHidden.setAttribute('data-offer-id', this.appService.offerSpecific[0]['offer_id']);
                spanHidden.setAttribute('data-offer-response', 'denied');

                errorDiv.append(spanHidden);


                errorDiv.classList.remove('active_error');


                errorDivSpan.textContent = `Êtes-vous sur de refuser l\'offre de ${this.appService.offerSpecific[0]['user_offer_firstname']} de ${this.appService.offerSpecific[0]['offer_offerprice']} €`;
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




}
