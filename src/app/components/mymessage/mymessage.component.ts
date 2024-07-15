import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mymessage',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mymessage.component.html',
    styleUrl: './mymessage.component.css'
})

export class MymessageComponent {

    productMessageObj = {};
    productMessageObjKeys: Array<any> = [];
    productMessageEnvelope: any = {};


    constructor(public appService: AppService, private router: Router) {

        this.appService.manageInterval();

        setTimeout(() => {

            this.getMessageByUser(this.appService.user.id);

            const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

            divMessaging.scrollTop = divMessaging.scrollHeight;


        }, 250);





        this.appService.intervalFetchMessage = setInterval(() => {


            this.getMessageByUser(this.appService.user.id);



            const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);
            const selectUser = (document.getElementsByClassName('section-mymessage-select-user')[0] as HTMLSelectElement);



            if (selectProduct !== undefined) {



                const selectedConversationCode = selectUser.options[selectUser.selectedIndex].getAttribute('data-conversation-code');

                if (selectedConversationCode !== null) {

                    const currentIdMessage = (document.getElementsByClassName('specific-offer-div-messaging-span-message-id-hidden') as HTMLCollectionOf<HTMLInputElement>);


                    const currentIdMessageArray = [];

                    for (let i = 0; i < currentIdMessage.length; i++) {

                        currentIdMessageArray.push(currentIdMessage[i].getAttribute('data-message-id'));
                    }

                    
                    




                    for (let y = 0; y < Object.keys((this.productMessageObj as any)[selectProduct.value][selectedConversationCode]).length; y++) {

                        let flag = false;

                        const idMessage = Object.keys((this.productMessageObj as any)[selectProduct.value][selectedConversationCode])[y];




                        for (let x = 0; x < currentIdMessageArray.length; x++) {

                            if (currentIdMessageArray[x] == idMessage) {

                                flag = true;
                                break;
                            }
                        }

                        

                        console.log((this.productMessageObj as any)[selectProduct.value][selectedConversationCode][idMessage]);

                        if (!flag) {

                            this.appService.createMessage((this.productMessageObj as any)[selectProduct.value][selectedConversationCode][idMessage].user_send_firstname, (this.productMessageObj as any)[selectProduct.value][selectedConversationCode][idMessage].message_contact_message, (this.productMessageObj as any)[selectProduct.value][selectedConversationCode][idMessage].message_contact_created_at, (this.productMessageObj as any)[selectProduct.value][selectedConversationCode][idMessage].message_contact_id);
                        }
                    }
                }
            }
            

        }, 10000);








        setTimeout(() => {

            const divMessagingWrap = (document.getElementsByClassName('div-wrap-send-message')[0] as HTMLDivElement);

            divMessagingWrap.classList.remove('pending');

        }, 600);
    
    }



    async getMessageByUser(user_id: any) {



        const response = await fetch(`${this.appService.hostname}/api/findmessagecontactbyuserid/${user_id}`, {
                method: 'GET'
        });

        const responseData = await response.json();


        
        this.uniqueProductFunc(responseData.result);

        



        // remove unnecessary product select //

        const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);






        if (selectProduct !== undefined) {


            const keepProduct = {};

            for (const product of Object.keys(this.productMessageObj)) {

                const productObj = {};

                for (const conversation of Object.keys((this.productMessageObj as any)[product])) {

                    const firstMessageConversation = ((this.productMessageObj as any)[product][conversation][Object.keys((this.productMessageObj as any)[product][conversation])[0]]);



                    if ((firstMessageConversation.message_contact_user_receive_id == this.appService.user.id && 
                        firstMessageConversation.message_contact_user_receive_id_status == 'visible')
                        ||
                        (firstMessageConversation.message_contact_user_send_id == this.appService.user.id && 
                        firstMessageConversation.message_contact_user_send_id_status == 'visible')) {

                            (productObj as any)[product] = true;
                            break;
                    }
                }

                Object.assign(keepProduct, productObj);
            }


            

            setTimeout(() => {

                for (const option of Object.keys(selectProduct.options)) {

                    let flag = false;

                    for (const product of Object.keys(keepProduct)) {

                        if (product == (selectProduct as any)[option].value) {

                            flag = true;
                            break;
                        }
                    }

                    
                    
                    if (!flag) {

                        if ((selectProduct as any)[option].value !== '-') {

                            (selectProduct as any)[option].remove();
                        }
                    }
                }
                
            }, 10);









            // add envelope to product if message not read //


            for (const product of Object.keys(this.productMessageObj)) {


                (this.productMessageEnvelope as any)[product] = true;



                for (const conversation of Object.keys((this.productMessageObj as any)[product])) {


                    for (const message of Object.keys((this.productMessageObj as any)[product][conversation])) {



                        // TODO => VERIFY CONDITION appService.user.id .. //

                        if ((this.productMessageObj as any)[product][conversation][message]['message_contact_user_receive_id_read'] == 'false' &&
                            (this.productMessageObj as any)[product][conversation][message]['message_contact_user_receive_id'] == this.appService.user.id) {

                            (this.productMessageEnvelope as any)[product] = false;
                            break;
                        }
                    }
                }
            }


            console.log(this.productMessageObj);
        }
    }






    uniqueProductFunc(array: Array<any>) {


        // unique product //

        for (let i = 0; i < array.length; i++) {



            let isInProduct = false;

            for (let y = 0; y < Object.keys(this.productMessageObj).length; y++) {

                if ((this.productMessageObj as any)[Object.keys(this.productMessageObj)[y]] == array[i].product_name) {

                    isInProduct = true;
                    break;
                }
            }




            if (!isInProduct) {

                (this.productMessageObj as any)[array[i].product_name] = {};
            }
        }





        // unique conversation //

        for (let x = 0; x < array.length; x++) {


            for (let z = 0; z < Object.keys(this.productMessageObj).length; z++) {


                if (Object.keys(this.productMessageObj)[z] == array[x].product_name) {

                    (this.productMessageObj as any)[Object.keys(this.productMessageObj)[z]][array[x].message_contact_conversation_code] = {};
                }

            }
        }


        this.productMessageObjKeys = Object.keys(this.productMessageObj);





        // unique message //

        for (let d = 0; d < array.length; d++) {

            (this.productMessageObj as any)[array[d].product_name][array[d].message_contact_conversation_code][array[d].message_contact_id] = array[d];
        }

    }









    handleChangeSelectProduct(e: Event) {

        const selectUserDiv = (document.querySelector('.section-mymessage-div-wrap.user'));
        const selectUser = (selectUserDiv?.getElementsByClassName('section-mymessage-select-user')[0] as HTMLSelectElement);

        const divMessagingWrap = (document.getElementsByClassName('div-wrap-send-message')[0] as HTMLDivElement);


        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

        const currentMessageDiv = (divMessaging.getElementsByClassName('specific-offer-div-messaging-div-wrap') as HTMLCollectionOf<HTMLDivElement>);


        const buttonHideConversation = (document.getElementsByClassName('button-hide-conversation')[0] as HTMLButtonElement);






        while (selectUser.children.length !== 1) {

            for (let t = 0; t < selectUser.children.length; t++) {

                if ((selectUser.children[t] as HTMLOptionElement).value !== '-') {

                    (selectUser.children[t] as HTMLOptionElement).remove();
                }
            }
        }




        while (currentMessageDiv.length > 0) {

            for (let u = 0; u < currentMessageDiv.length; u++) {

                currentMessageDiv[u].remove();
            }
        }


        divMessagingWrap.classList.remove('active');
        buttonHideConversation.classList.remove('active');






        if ((e.target as HTMLSelectElement).value == '-') {

            selectUserDiv?.classList.remove('active');

            divMessagingWrap.classList.remove('active');

            
        }


        else {



            for (let i = 0; i < Object.keys((this.productMessageObj as any)[(e.target as HTMLSelectElement).value]).length; i++) {



                let nameUser = null;
                let user_send_id = null;
                let conversation_code = null;

                for (let y = 0; y < Object.keys((((this.productMessageObj as any)[(e.target as HTMLSelectElement).value][(Object.keys((this.productMessageObj as any)[(e.target as HTMLSelectElement).value])[i] as any)]))).length; y++) {



                    const messages = ((((this.productMessageObj as any)[(e.target as HTMLSelectElement).value][(Object.keys((this.productMessageObj as any)[(e.target as HTMLSelectElement).value])[i] as any)])));



                    for (const message of Object.keys(messages)) {



                        if (messages[message].message_contact_user_send_id !== this.appService.user.id) {

                            nameUser = messages[message].user_send_firstname;
                            user_send_id = messages[message].user_send_id;
                            conversation_code = messages[message].message_contact_conversation_code;
                            break;
                        }
                        
                        else if (messages[message].message_contact_user_send_id == this.appService.user.id) {

                            nameUser = messages[message].user_receive_firstname;
                            user_send_id = messages[message].user_receive_id;
                            conversation_code = messages[message].message_contact_conversation_code;
                            break;
                        }
                    }
                }




                const firstMessageConversation = (this.productMessageObj as any)[(e.target as HTMLSelectElement).value][conversation_code][Object.keys((this.productMessageObj as any)[(e.target as HTMLSelectElement).value][conversation_code])[0]];



                const optionElement = document.createElement('option');
                optionElement.setAttribute('value', user_send_id);
                optionElement.setAttribute('data-conversation-code', conversation_code);
                optionElement.textContent = nameUser;


                if (firstMessageConversation.message_contact_user_receive_id == this.appService.user.id) {

                    if (firstMessageConversation.message_contact_user_receive_id_status == 'visible') {

                        selectUser.append(optionElement);
                    }
                }




                else if (firstMessageConversation.message_contact_user_send_id == this.appService.user.id) {

                    if (firstMessageConversation.message_contact_user_send_id_status == 'visible') {

                        selectUser.append(optionElement);
                    }
                }
                
            }



            selectUserDiv?.classList.add('active');
        }
    }









    async handleChangeSelectUserMessage(e: Event) {

        const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);

        const userId = (e.target as HTMLSelectElement).value;

        const conversation_code = (e.target as HTMLSelectElement).options[(e.target as HTMLSelectElement).selectedIndex].getAttribute('data-conversation-code');

        const productNameSelected = selectProduct.options[selectProduct.selectedIndex].value;

        const buttonHideConversation = (document.getElementsByClassName('button-hide-conversation')[0] as HTMLButtonElement);







        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);




        const currentMessageDiv = (divMessaging.getElementsByClassName('specific-offer-div-messaging-div-wrap') as HTMLCollectionOf<HTMLDivElement>);





        const divMessagingWrap = (document.getElementsByClassName('div-wrap-send-message')[0] as HTMLDivElement);





        while (currentMessageDiv.length > 0) {

            for (let u = 0; u < currentMessageDiv.length; u++) {

                currentMessageDiv[u].remove();
            }
        }
        




        

        if ((e.target as HTMLSelectElement).value == '-') {

            divMessagingWrap.classList.remove('active');
            buttonHideConversation.classList.remove('active');
        }




        else if ((e.target as HTMLSelectElement).value  !== '-') {

            divMessagingWrap.classList.add('active');
            buttonHideConversation.classList.add('active');




            const messages = ((this.productMessageObj as any)[productNameSelected][conversation_code as string]);

            for (const message of Object.keys(messages)) {

                this.appService.createMessage(messages[message].user_send_firstname, messages[message].message_contact_message, messages[message].message_contact_created_at, messages[message].message_contact_id);
            }
        }











        // manage envelope message read //



        if (conversation_code !== null) {

            const response = await fetch(`${this.appService.hostname}/api/getmessagecontactbyconversationcode/${conversation_code}/user/${this.appService.user.id}`, {

                method: 'GET',
                // headers: {
                //     'Content-type': 'application/json',
                //     'Authorization': `Bearer ${this.appService.user.jwt}`
                // }
            });


            const responseData = await response.json();

            console.log(responseData);


            if (responseData.flag) {


                if (responseData.hasOwnProperty('messageContactReadStillFalse')) {

                    if (responseData.messageContactReadStillFalse == false) {

                        this.appService.messageContactNotRead = 'false';

                        document.cookie = `messageContactNotReadGiveDiscount=${this.appService.messageContactNotRead};path=/`;
                    }
                }
            }
        }
    }
















    handleClickHideConversation(e: Event) {

        e.preventDefault();

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);

        const selectUserDiv = (document.querySelector('.section-mymessage-div-wrap.user'));

        const selectUser = (selectUserDiv?.getElementsByClassName('section-mymessage-select-user')[0] as HTMLSelectElement);

        const conversation_code = selectUser.options[selectUser.selectedIndex].getAttribute('data-conversation-code');
        const user_id = (selectUser.options[selectUser.selectedIndex].value);

        console.log(conversation_code);
        console.log(user_id);

        console.log(this.appService.user.id);



        // if user logged in //

        if (this.appService.user.id > 0) {



            this.appService.timeoutRoute = setTimeout(() => {

                const spanHidden = document.createElement('span');
                spanHidden.setAttribute('class', 'error-div-span-hidden');
                spanHidden.setAttribute('data-conversation-code-hidden', conversation_code as string);
                spanHidden.setAttribute('data-user-id-action', this.appService.user.id.toString());

                errorDiv.append(spanHidden);

                errorDivSpan.textContent = `Supprimer la conversation avec ${selectUser.options[selectUser.selectedIndex].textContent} pour le produit ${selectProduct.options[selectProduct.selectedIndex].textContent} ?`;
                errorConfirmDiv.classList.add('active_confirm');
                errorDiv.classList.add('active_confirm');
            }, 750);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
















    async handleClickSendMessage(e: MouseEvent) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const crossFilter = (document.getElementsByClassName('cross-filter-offer')[0] as HTMLButtonElement);



        const inputMessage = (document.getElementsByClassName('specific-offer-input-messaging')[0] as HTMLTextAreaElement);





        const selectProduct = (document.getElementsByClassName('section-mymessage-select-product')[0] as HTMLSelectElement);
        const selectUser = (document.getElementsByClassName('section-mymessage-select-user')[0] as HTMLSelectElement);



        if (this.appService.user.jwt.length == 0) {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });



            this.appService.timeoutRoute = setTimeout(() => {

                errorDivSpan.textContent = 'Veuillez vous authentifier pour émettre un message';
                errorDiv.classList.add('active_error');
            }, 500);



            this.appService.timeoutRoute = setTimeout(() => {

                errorDiv.classList.remove('active_error');
            }, 3500);
        }








        else if (inputMessage.value.trim().length == 0) {

            inputMessage.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
            inputMessage.focus();
        }





        

        else if (inputMessage.value.trim().length > 0) {


            const conversation_code = selectUser.options[selectUser.selectedIndex].getAttribute('data-conversation-code');


            // get first message of chat (as en example, can be the second, third ..) conversation to get product user id AND product id

            const product_user_id = (this.productMessageObj as any)[selectProduct.value][conversation_code as string][Object.keys((this.productMessageObj as any)[selectProduct.value][conversation_code as string])[0]].product_user_id;

            const product_id = (this.productMessageObj as any)[selectProduct.value][conversation_code as string][Object.keys((this.productMessageObj as any)[selectProduct.value][conversation_code as string])[0]].product_id;


            console.log(product_user_id);
            console.log(this.appService.user.id);
            console.log(selectUser.options[selectUser.selectedIndex].value);
            console.log(inputMessage.value.trim());

            console.log(product_id);





            const response = await fetch(`${this.appService.hostname}/api/insertmessagecontact`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.appService.user.jwt}`
                },
                body: JSON.stringify({
                    user_product_id: product_user_id,
                    user_send_id: this.appService.user.id,
                    user_receive_id: selectUser.options[selectUser.selectedIndex].value,
                    product_id: product_id,
                    message: inputMessage.value.trim(),

                    conversation_code: conversation_code
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

                this.appService.createMessage(this.appService.user.firstname, inputMessage.value.trim(), this.appService.getCurrentDateTime(), responseData.lastMessageInserted[0].id);

                this.getMessageByUser(this.appService.user.id);

                inputMessage.value = '';
                inputMessage.focus();
            }
        }
    }
}

