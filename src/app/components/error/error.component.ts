import { Component, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.css'
})

export class ErrorComponent {

    constructor(public appService: AppService, private router: Router) {

    }

    async handleClickAnswer(e: MouseEvent) {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const errorDivSpanHidden = (document.getElementsByClassName('error-div-span-hidden')[0] as HTMLSpanElement);






        // post new product   OR   edit product //

        if (window.location.pathname.startsWith('/post') || window.location.pathname.startsWith('/myaccount/product/edit')) {


            // if delete product => run this code to skip next code //

            if (errorDivSpanHidden !== undefined) {

                const product_id_delete = errorDivSpanHidden.getAttribute('data-product-id-delete');




                if (product_id_delete !== null) {




                    if ((e.currentTarget as HTMLDivElement).classList.contains('no')) {


                        // remove span hidden if not undefined (product_id delete ..) //
        
                        if (errorDivSpanHidden !== undefined) {
        
                            errorDivSpanHidden.remove();
                        }
        
        
        
        
                        this.appService.timeoutRoute = setTimeout(() => {
                            errorDivSpan.textContent = '';
                            errorConfirmDiv.classList.remove('active_confirm');
                        }, 1000);
        
                        errorDiv.classList.remove('active_confirm');
                        mainElement.classList.remove('blur');

                        return;
                    }



                    else if ((e.currentTarget as HTMLDivElement).classList.contains('yes')) {


                        const response = await fetch(`${this.appService.hostname}/api/deleteproduct/${product_id_delete}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': `Bearer ${this.appService.user.jwt}`
                            }
                        })

                        const responseData = await response.json();

                        console.log(responseData);





                        if (responseData.flag) {

                            mainElement.classList.remove('blur');
                            errorConfirmDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_error');
                            errorDiv.classList.remove('active_success');
                            


                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });

                            errorDivSpan.textContent = 'Produit supprimé avec succès';

                            errorDiv.classList.add('active_success');



                            this.appService.timeoutRoute = setTimeout(() => {

                                errorDiv.classList.remove('active_success');

                            }, 2500);



                            this.appService.timeoutRoute = setTimeout(() => {

                                this.appService.handleClickBackButton();
                            }, 3000);
                        }





                        if (!responseData.flag) {


                            if (responseData.message.startsWith('Expired token')) {

                                mainElement.classList.remove('blur');
                                errorConfirmDiv.classList.remove('active_confirm');
                                errorDiv.classList.remove('active_confirm');
                                errorDiv.classList.remove('active_error');
                                errorDiv.classList.remove('active_success');

                                this.appService.timeoutRoute = setTimeout(() => {
                
                                errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
            
                                errorDiv.classList.add('active_error');
            
                                }, 750);
                    
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }
                        }

                        errorDivSpanHidden.remove();

                        return;
                    }
                }
            }

            







            if ((e.currentTarget as HTMLDivElement).classList.contains('no')) {


                // remove span hidden if not undefined (product_id delete ..) //

                if (errorDivSpanHidden !== undefined) {

                    errorDivSpanHidden.remove();
                }




                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');
            }




            else if ((e.currentTarget as HTMLDivElement).classList.contains('yes')) {

                /* remove error box */

                this.appService.timeoutRoute = setTimeout(() => {
                    // errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');



                console.log(this.appService.newPostObject);








                const formData = new FormData();


                for (const key of Object.keys(this.appService.newPostObject)) {

                    if (key !== 'picture') {

                        formData.append(key, (this.appService.newPostObject as any)[key].toString());
                    }





                    else if (key == 'picture') { // if key == 'picture' => pictures object uploaded //




                        if (Object.keys((this.appService.newPostObject as any)[key]).length > 0) { // if pictures object is not empty => pictures added by user //

                            for (const pictureKey of Object.keys((this.appService.newPostObject as any)[key])) {

                                //formData.append(picture.name, picture);
                                formData.append(`pic_${pictureKey}`, (this.appService.newPostObject as any)[key][pictureKey]);
                            }
                        }
                    }

                }

                for (const key of (formData as any).keys()) {

                    console.log(key);
                    console.log(formData.get(key));
                }






                // check if city in database //

                const responseCheckCityDatabase = await fetch(`${this.appService.hostname}/api/checkcity`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        city: formData.get('city'),
                        zip: formData.get('zip')
                    })
                });

                const responseDataCheckCityDatabase = await responseCheckCityDatabase.json();




                // if city found in database //

                if (responseDataCheckCityDatabase.checkCity.length > 0) {

                    console.log(responseDataCheckCityDatabase.checkCity[0]['latitude']);
                    console.log(responseDataCheckCityDatabase.checkCity[0]['longitude']);
                    console.log('FOUND!');

                    formData.append('latitude', responseDataCheckCityDatabase.checkCity[0]['latitude']);
                    formData.append('longitude', responseDataCheckCityDatabase.checkCity[0]['longitude']);
                }



                // if city NOT found in database //

                else if (responseDataCheckCityDatabase.checkCity.length == 0) {

                    console.log('NOT FOUND!');

                    // get coordinates from city //

                    const responseCityCoordinatesBack = await fetch(`${this.appService.hostname}/api/getcoordinates/city/${formData.get('city')}/zip/${formData.get('zip')}`, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    });

                    const responseDataCityCoordinatesBack = await responseCityCoordinatesBack.json();

                    formData.append('latitude', responseDataCityCoordinatesBack.latitude);
                    formData.append('longitude', responseDataCityCoordinatesBack.longitude);






                    const responseCityInsert = await fetch(`${this.appService.hostname}/api/insertcity`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            city: formData.get('city'),
                            zip: formData.get('zip'),
                            latitude: formData.get('latitude'),
                            longitude: formData.get('longitude')
                        })
                    });

                    const responseDataCityInsert = await responseCityInsert.json();

                    console.log(responseDataCityInsert);
                }










                let responseData: any = null;

                if (window.location.pathname.startsWith('/post')) {


                    formData.append('Authorization', this.appService.user.jwt);

                    const response = await fetch(`${this.appService.hostname}/api/insertproduct`, {
                        method: 'POST',
                        body: formData
                    });

                    const responseData = await response.json();




                    if (responseData.hasOwnProperty('flag')) {

                        if (responseData.flag) {
    
    
                            errorConfirmDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_error');
                            errorDiv.classList.remove('active_success');
                            
    
    
    
    
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
    
                            errorDivSpan.textContent = 'Produit ajouté avec succès';
    
                            errorDiv.classList.add('active_success');
    
    
    
                            this.appService.timeoutRoute = setTimeout(() => {
    
                                errorDiv.classList.remove('active_success');
    
                            }, 2500);
    
    
    
                            this.appService.timeoutRoute = setTimeout(() => {
    
                                window.location.href = '/';
                            }, 3000);
                        }





                        else if (!responseData.flag) {


                            if (responseData.message.startsWith('Expired token')) {

                                this.appService.timeoutRoute = setTimeout(() => {
            
                                errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
            
                                errorDiv.classList.add('active_error');
            
                                }, 750);
                    
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
            
                            }
                        }
                    }
                }






                else if (window.location.pathname.startsWith('/myaccount/product/edit')) {




                    for (const nameFile of Object.keys(this.appService.objectNameFileUpdate)) {

                        formData.append(nameFile, (this.appService.objectNameFileUpdate as any)[nameFile]);
                    }




                    formData.append('Authorization', this.appService.user.jwt);



                    const response = await fetch(`${this.appService.hostname}/api/updateproduct/${window.location.pathname.replace('/myaccount/product/edit/', '')}`, {
                        method: 'POST',
                        body: formData
                    })

                    const responseData = await response.json();

                    console.log(responseData);





                    if (responseData.hasOwnProperty('flag')) {

                        if (responseData.flag) {


                            errorConfirmDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_confirm');
                            errorDiv.classList.remove('active_error');
                            errorDiv.classList.remove('active_success');
                            




                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });

                            errorDivSpan.textContent = 'Produit modifié avec succès';

                            errorDiv.classList.add('active_success');



                            this.appService.timeoutRoute = setTimeout(() => {

                                errorDiv.classList.remove('active_success');
                            }, 2500);
                        }




                        else if (!responseData.flag) {

                            if (responseData.message.startsWith('Expired token')) {

                                this.appService.timeoutRoute = setTimeout(() => {
            
                                errorDivSpan.textContent = 'Veuillez vous reconnecter à votre compte';
            
                                errorDiv.classList.add('active_error');
            
                                }, 750);
                    
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth'
                                });
                            }




                            else if (responseData.message.startsWith('User already registered')) {

                                this.appService.timeoutRoute = setTimeout(() => {
            
                                    errorDivSpan.textContent = 'Veuillez utiliser un autre email';
                
                                    errorDiv.classList.add('active_error');
                
                                    }, 750);
                        
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth'
                                    });
                            }
                        }
                    }
                }
            }
        }







        // make offer on product page //

        else if (window.location.pathname.startsWith('/product')) {



            const inputOffer = (document.getElementsByClassName('section-search-result-element-make-offer-div-input')[0] as HTMLInputElement);






            if ((e.currentTarget as HTMLDivElement).classList.contains('no')) {


                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');
            }







            else if ((e.currentTarget as HTMLDivElement).classList.contains('yes')) {

                /* remove error box */

                this.appService.timeoutRoute = setTimeout(() => {
                    // errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');







                const formData = new FormData();



                console.log(this.appService.user);




                if (this.appService.user.id == 0) {

                    this.appService.timeoutRoute = setTimeout(() => {
                        errorDivSpan.textContent = '';
                        errorConfirmDiv.classList.remove('active_confirm');
                    }, 1000);
    
                    errorDiv.classList.remove('active_confirm');
                    mainElement.classList.remove('blur');





                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDivSpan.textContent = 'Veuillez vous authentifier pour émettre une offre';
                        errorDiv.classList.add('active_error');
                    }, 1000);



                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_error');

                    }, 3500);
                }











                else if (inputOffer.value.trim() !== '') {

                    formData.append('offer', inputOffer.value.trim());

                    formData.append('product_id', window.location.pathname.replace('/product/', ''));
                    formData.append('user_id', this.appService.user.id.toString());




                    const response = await fetch(`${this.appService.hostname}/api/insertoffer`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.appService.user.jwt}`
                        },
                        body: formData
                    });
    
    
                    const responseData = await response.json();
    
                    
                    

                    if (responseData.flag) {

                        this.appService.timeoutRoute = setTimeout(() => {
                            errorDivSpan.textContent = '';
                            errorConfirmDiv.classList.remove('active_confirm');
                        }, 1000);
        
                        errorDiv.classList.remove('active_confirm');
                        mainElement.classList.remove('blur');
    
    
    
    
    
                        this.appService.timeoutRoute = setTimeout(() => {
    
                            errorDivSpan.textContent = 'Offre transmise avec succès';
                            errorDiv.classList.add('active_success');
                        }, 1000);
    
    
    
                        this.appService.timeoutRoute = setTimeout(() => {
    
                            errorDiv.classList.remove('active_success');
    
                        }, 3500);




                        this.appService.timeoutRoute = setTimeout(() => {

                            window.location.reload();
                        }, 4000);
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
                            }, 1000);
        
        
        
                            this.appService.timeoutRoute = setTimeout(() => {
        
                                errorDiv.classList.remove('active_error');
        
                            }, 3500);
                        }
                    }
                }




            }
        }











        // accept or deny offer myoffer page //

        else if (window.location.pathname.startsWith('/myoffer')) {



            const errorDivSpanHiddenCollection = (document.getElementsByClassName('error-div-span-hidden') as HTMLCollectionOf<HTMLSpanElement>);

            if ((e.currentTarget as HTMLDivElement).classList.contains('no')) {


                while (errorDivSpanHiddenCollection.length > 0) {

                    for (let i = 0; i < errorDivSpanHiddenCollection.length; i++) {

                        errorDivSpanHiddenCollection[i].remove();
                    }
                }


                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');
            }








            else if ((e.currentTarget as HTMLDivElement).classList.contains('yes')) {




                /* remove error box */

                this.appService.timeoutRoute = setTimeout(() => {
                    // errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');






                const response = await fetch(`${this.appService.hostname}/api/updateofferstatus`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${this.appService.user.jwt}`
                    },
                    body: JSON.stringify({
                        offerId: errorDivSpanHidden.getAttribute('data-offer-id'),
                        response: errorDivSpanHidden.getAttribute('data-offer-response')
                    })
                });

                const responseData = await response.json();




                while (errorDivSpanHiddenCollection.length > 0) {

                    for (let i = 0; i < errorDivSpanHiddenCollection.length; i++) {

                        errorDivSpanHiddenCollection[i].remove();
                    }
                }






                if (responseData.flag) {


                    this.appService.timeoutRoute = setTimeout(() => {
    
                        responseData.response ? 
                            (errorDivSpan.textContent = 'Offre acceptée', errorDiv.classList.add('active_success')) : 

                        !responseData.response ? 
                            (errorDivSpan.textContent = 'Offre refusée', errorDiv.classList.add('active_error')) : 
                            '';

                        
                    }, 1000);



                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_success');
                        errorDiv.classList.remove('active_error');

                    }, 3500);



                    this.appService.timeoutRoute = setTimeout(() => {

                        window.location.reload();
                    }, 4000);
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
                        }, 1000);
                    }
                }


            }
        }











        // delete conversation message //

        else if (window.location.pathname.startsWith('/mymessage')) {



            const errorDivSpanHiddenCollection = (document.getElementsByClassName('error-div-span-hidden') as HTMLCollectionOf<HTMLSpanElement>);



            if ((e.currentTarget as HTMLDivElement).classList.contains('no')) {


                while (errorDivSpanHiddenCollection.length > 0) {

                    for (let i = 0; i < errorDivSpanHiddenCollection.length; i++) {

                        errorDivSpanHiddenCollection[i].remove();
                    }
                }


                this.appService.timeoutRoute = setTimeout(() => {
                    errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');
            }





            else if ((e.currentTarget as HTMLDivElement).classList.contains('yes')) {




                /* remove error box */

                this.appService.timeoutRoute = setTimeout(() => {
                    // errorDivSpan.textContent = '';
                    errorConfirmDiv.classList.remove('active_confirm');
                }, 1000);

                errorDiv.classList.remove('active_confirm');
                mainElement.classList.remove('blur');







                const response = await fetch(`${this.appService.hostname}/api/hideconversation`, {

                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${this.appService.user.jwt}`
                    },
                    body: JSON.stringify({
                        conversation_code: errorDivSpanHiddenCollection[0].getAttribute('data-conversation-code-hidden'),
                        user_id_action: errorDivSpanHiddenCollection[0].getAttribute('data-user-id-action')
                    })
                })




                while (errorDivSpanHiddenCollection.length > 0) {

                    for (let i = 0; i < errorDivSpanHiddenCollection.length; i++) {

                        errorDivSpanHiddenCollection[i].remove();
                    }
                }



                const responseData = await response.json();

                console.log(responseData);



                if (!responseData.flag) {

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
                        }, 1000);
    
    
    
                        this.appService.timeoutRoute = setTimeout(() => {
    
                            errorDiv.classList.remove('active_error');
    
                        }, 3500);
                    }
                }








                else if (responseData.flag) {

                    const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);
                    const selectUser = (document.getElementsByClassName('section-mymessage-select-user')[0] as HTMLSelectElement);

                    const divMessagingWrap = (document.getElementsByClassName('div-wrap-send-message')[0] as HTMLDivElement);

                    const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);
                    const currentMessageDiv = (divMessaging.getElementsByClassName('specific-offer-div-messaging-div-wrap') as HTMLCollectionOf<HTMLDivElement>);

                    const selectUserDiv = (document.querySelector('.section-mymessage-div-wrap.user'));

                    const buttonHideConversation = (document.getElementsByClassName('button-hide-conversation')[0] as HTMLButtonElement);





                    selectUserDiv?.classList.remove('active');
                    buttonHideConversation.classList.remove('active');
                    divMessagingWrap.classList.remove('active');




                    // remove option to "delete" conversation AND remove all messages //

                    
                    selectUser.options[selectUser.selectedIndex].remove();

                    while (currentMessageDiv.length > 0) {

                        for (let u = 0; u < currentMessageDiv.length; u++) {
            
                            currentMessageDiv[u].remove();
                        }
                    }



                    // if no more user option -> remove product from list //

                    if (selectUser.options.length == 1) {

                        selectProduct.options[selectProduct.selectedIndex].remove();
                    }







                    this.appService.timeoutRoute = setTimeout(() => {
                        errorDivSpan.textContent = '';
                        errorConfirmDiv.classList.remove('active_confirm');
                    }, 1000);
    
                    errorDiv.classList.remove('active_confirm');
                    mainElement.classList.remove('blur');





                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDivSpan.textContent = 'Conversation effacée avec succès';
                        errorDiv.classList.add('active_success');
                    }, 1000);



                    this.appService.timeoutRoute = setTimeout(() => {

                        errorDiv.classList.remove('active_success');

                    }, 3500);
                }

            }
        }
    }
}
