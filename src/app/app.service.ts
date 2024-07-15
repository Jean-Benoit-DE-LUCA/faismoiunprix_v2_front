import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface UserInterface {
    id: number;
    name: string;
    firstname: string;
    email: string;
    phone: string;
    password: string;
    created_at: string;
    updated_at: string;
    jwt: string;
};

interface CategoryInterface {
    id: number;
    name: string;
};



@Injectable({
    providedIn: 'root'
})
export class AppService {


    hostname: string = 'http://localhost:8000';

    user: UserInterface = {
        id: 0,
        name: '',
        firstname: '',
        email: '',
        phone: '',
        password: '',
        created_at: '',
        updated_at: '',
        jwt: ''
    };

    category: Array<CategoryInterface> = [];

    isLogged: boolean = false;

    searchWord: string = '';

    searchResult = {};

    searchResultKept: any = [];
    searchResultKeptSortOffer: any = [];





    newPostObject = {};

    objectNameFileUpdate = {};




    timeoutRoute: ReturnType<typeof setTimeout> | null = null;

    intervalFetchMessage: ReturnType<typeof setInterval> | null = null;






    timeoutScrollCarousel: ReturnType<typeof setTimeout> | null = null;

    intervalScrollCarousel: ReturnType<typeof setInterval> | null = null;

    timeoutUserId: ReturnType<typeof setTimeout> | null = null;






    intervalCheckMessage: ReturnType<typeof setInterval> | null = null;
    intervalCheckMessageContact: ReturnType<typeof setInterval> | null = null;






    messageContactNotRead: string = 'false';
    messageNotRead: string = 'false';







    getLastProductArray: any = [];

    getOtherProductArrayUser: any = [];








    constructor(private location: Location, public router: Router) {

        this.checkCookie();

        this.getCategoryAll();

        this.checkMessage();
        this.checkMessageContact();




        window.addEventListener('load', () => {

            const inputSearch = (document.getElementsByClassName('header-div-searchbar-div-input')[0] as HTMLInputElement);

            document.documentElement.style.setProperty('--leftSearchBorderAnim', Number(inputSearch.offsetLeft - 1) + 'px');

            document.documentElement.style.setProperty('--rightSearchBorderAnim', Number(inputSearch.offsetLeft - 1) + 'px');
        });



        window.addEventListener('resize', (e) => {

            const inputSearch = (document.getElementsByClassName('header-div-searchbar-div-input')[0] as HTMLInputElement);

            document.documentElement.style.setProperty('--leftSearchBorderAnim', Number(inputSearch.offsetLeft - 1) + 'px');

            document.documentElement.style.setProperty('--rightSearchBorderAnim', Number(inputSearch.offsetLeft - 1) + 'px');






            // footer //

            const body = (document.getElementsByTagName('body')[0] as HTMLBodyElement);
            const footer = (document.getElementsByClassName('footer')[0] as HTMLElement);

            footer.style.setProperty('--widthBody', window.getComputedStyle(body).width);

        });
    }





    



    /*METHOD*/

    async checkCookie() {

        const cookieArray: Array<string> = document.cookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {

            if (cookieArray[i].trim().startsWith('userGiveDiscount')) {

                
                const response = await fetch(`${this.hostname}/api/getdatasession`, {
                    method: 'POST',
                    body: JSON.stringify({
                        session: JSON.parse(cookieArray[i].trim().replace('userGiveDiscount=', ''))
                    })
                });

                const responseData = await response.json();





                if (responseData.flag) {

                    this.user = Object.assign({}, responseData.user[0]);
                    this.isLogged = true;
                }
            }





            if (cookieArray[i].trim().startsWith('messageContactNotReadGiveDiscount')) {

                this.messageContactNotRead = cookieArray[i].trim().replace('messageContactNotReadGiveDiscount=', '');                
            }

            if (cookieArray[i].trim().startsWith('messageNotReadGiveDiscount')) {

                this.messageNotRead = cookieArray[i].trim().replace('messageNotReadGiveDiscount=', '');
            }
        }
    }




















    async getCategoryAll() {

        const response = await fetch(`${this.hostname}/api/getcategoryall`, {
            method: 'GET'
        });

        const responseData = await response.json();


        this.category = responseData.result.slice();
    }





    translateCategory(name: string) {

        let finalValue = '';

        name == 'real_estate' ? finalValue = 'Immobilier' :
        name == 'vehicle' ? finalValue = 'Véhicules' :
        name == 'electronic' ? finalValue = 'Électronique' :
        name == 'service' ? finalValue = 'Services' :
        name == 'pet' ? finalValue = 'Animaux' :
        name == 'fashion' ? finalValue = 'Mode' :
        name == 'leisure_entertainment' ? finalValue = 'Loisirs et divertissement' :
        name == 'home' ? finalValue = 'Maison' :
        name == 'garden_outdoor' ? finalValue = 'Jardin et bricolage' :
        '';

        return finalValue;
    }









    handleKeyUpInputLength(e: Event) {

        // if select category //

        if ((e.target as HTMLSelectElement).className == 'section-post-title-select-category') {

            if ((e.target as HTMLSelectElement).value !== '-') {

                (e.target as HTMLSelectElement).style.borderColor = 'initial';
            }
        }





        // if input //


        if ((e.target as HTMLInputElement).value.length > 0) {



            if ((e.target as HTMLInputElement).className == 'search-filter-input-zip' || (e.target as HTMLInputElement).className == 'search-filter-input-city') {

                (e.target as HTMLInputElement).style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--colorDateTimeProduct');
            }


            else {

                (e.target as HTMLInputElement).style.borderColor = 'initial';
            }


            
        }






        // if textarea //

        if ((e.target as HTMLTextAreaElement).value.length > 0) {



            if ((e.target as HTMLTextAreaElement).className == 'product-textarea-contact') {

                (e.target as HTMLTextAreaElement).style.outlineColor = 'initial';
            }
        }
    }









    getCurrentDateTime() {

        const date = new Date();

        let year = date.getFullYear();
        let month: string | number = Number(date.getMonth() + 1);
        let day: string | number = date.getDate();

        let hour: string | number = date.getHours();
        let minute: string | number = date.getMinutes();
        let second: string |number = date.getSeconds();


        if (Number(month) < 10) {

            month = '0' + month;
        }

        if (Number(day) < 10) {

            day = '0' + day;
        }

        if (Number(hour) < 10) {

            hour = '0' + hour;
        }

        if (Number(minute) < 10) {

            minute = '0' + minute;
        }

        if (Number(second) < 10) {

            second = '0' + second;
        }

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }








    lengthSpanTitleFunction() {


        setTimeout(() => {

            const spanTitle = (document.getElementsByClassName('section-search-result-element-span-title-span')[0] as HTMLSpanElement);


            if (spanTitle !== undefined) {


                const minWidth900 = window.matchMedia('(min-width: 900px)');

                if (minWidth900.matches) {

                    const spanTitleWrap = (document.getElementsByClassName('section-search-result-element-span-title')[0] as HTMLSpanElement);
                    const spanTitle = (document.getElementsByClassName('section-search-result-element-span-title-span')[0] as HTMLSpanElement);

                    document.documentElement.style.setProperty('--lengthSpanTitle', '-' + (spanTitleWrap.offsetWidth + spanTitle.offsetWidth) + 'px');
                }

                else {

                    const spanTitleWrap = document.createElement('span');
                    spanTitleWrap.setAttribute('class', 'section-search-result-element-span-title fake');

                    const spanTitleFake = document.createElement('span');
                    spanTitleFake.setAttribute('class', 'section-search-result-element-span-title-span fake');
                    spanTitleFake.textContent = spanTitle.textContent;

                    spanTitleWrap.append(spanTitleFake);

                    document.getElementsByClassName('container')[0].append(spanTitleWrap);
                    
                    document.documentElement.style.setProperty('--lengthSpanTitle', '-' + (spanTitleWrap.offsetWidth + spanTitleFake.offsetWidth) + 'px');
                }


                
            }
        }, 100);
    }












    /*--- HANDLE CLICK BACK BUTTON ---*/

    handleClickBackButton(e: MouseEvent | undefined = undefined) {

        if (e !== undefined) {

            e.preventDefault();
        }

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);


        errorConfirmDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_error');
        errorDiv.classList.remove('active_success');
        mainElement.classList.remove('blur');


        if (this.timeoutRoute !== null) {

            clearTimeout(this.timeoutRoute);

            this.timeoutRoute = null;
        }




        if (this.intervalFetchMessage !== null) {

            clearInterval(this.intervalFetchMessage);

            this.intervalFetchMessage = null;
        }


        this.location.back();
    }










    /*--- COUNTER FAKE MESSAGE ---*/

    counterFakeMessage(num: number) {

        return new Array(num)
    }
















    /*--- CREATE MESSAGE ---*/

    createMessage(user_firstname: string, message: string, currentDateTime: string, message_id: string) {

        const divMessaging = (document.getElementsByClassName('specific-offer-div-messaging')[0] as HTMLDivElement);

        const divElement = document.createElement('div');
        divElement.setAttribute('class', 'specific-offer-div-messaging-div-wrap');

        const spanElementUser = document.createElement('span');
        spanElementUser.setAttribute('class', 'specific-offer-div-messaging-span-user');
        spanElementUser.textContent = `${user_firstname}:`;

        const spanElementMessage = document.createElement('span');
        spanElementMessage.setAttribute('class', 'specific-offer-div-messaging-span-message');
        spanElementMessage.textContent = message;

        const spanElementDateTime = document.createElement('span');
        spanElementDateTime.setAttribute('class', 'specific-offer-div-messaging-span-datetime');
        spanElementDateTime.textContent = currentDateTime;

        const spanElementMessageId = document.createElement('span');
        spanElementMessageId.setAttribute('class', 'specific-offer-div-messaging-span-message-id-hidden');
        spanElementMessageId.setAttribute('data-message-id', message_id);



        divElement.append(spanElementUser);
        divElement.append(spanElementMessage);
        divElement.append(spanElementDateTime);
        divElement.append(spanElementMessageId);


        divMessaging.append(divElement);

        
        divMessaging.scrollTop = divMessaging.scrollHeight;
    }
















    /*--- CHECK MESSAGE INCOMING ---*/

    checkMessage() {

        this.intervalCheckMessage = setInterval(async () => {

            const responseMessage = await fetch(`${this.hostname}/api/checkmessage`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.user.jwt}`
                },
                body: JSON.stringify({
                    userId: this.user.id
                })
            });

            const responseMessageData = await responseMessage.json();



            if (responseMessageData.flag) {

                if (responseMessageData.hasOwnProperty('messageNotRead')) {

                    if (responseMessageData.messageNotRead) {

                        this.messageNotRead = 'true';

                        document.cookie = `messageNotReadGiveDiscount=${this.messageNotRead};path=/`;
                    }
                }
            }

            console.log(responseMessageData);
        }, 300000);  // 5min
    }










    checkMessageContact() {

        //TODO => UNCOMMENT

        this.intervalCheckMessageContact = setInterval(async() => {

            const responseMessage = await fetch(`${this.hostname}/api/checkmessagecontact`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.user.jwt}`
                },
                body: JSON.stringify({
                    userId: this.user.id
                })
            });

            const responseMessageData = await responseMessage.json();

            console.log(responseMessageData);



            if (responseMessageData.flag) {

                if (responseMessageData.hasOwnProperty('messageContactReadStillFalse')) {

                    if (!responseMessageData.messageContactReadStillFalse) {

                        this.messageContactNotRead = 'false';
                    }
                }
            }
        }, 300000); // 5min
    }















    /*--- MANAGE INTERVAL DEPENDS ON ROUTE ---*/

    manageInterval() {

        console.log(window.location.pathname);

        if (!window.location.pathname.startsWith('/myoffer') || !window.location.pathname.startsWith('/mymessage')) {

            if (this.intervalFetchMessage !== null) {

                clearInterval(this.intervalFetchMessage);
    
                this.intervalFetchMessage = null;
            }
        }
    }


















    /*--- HOME CAROUSEL | PRODUCT CAROUSEL ---*/





    // home page last product ///

    async getLastProduct() {

        const response = await fetch(`${this.hostname}/api/getproducts?search=`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const responseData = await response.json();

        this.getLastProductArray = responseData.result.slice(0, 10);

        return this.getLastProductArray;
    }





    // product page others product //

    async getProductsByUserIdAlt(user_id: number) {
        
        const response = await fetch(`${this.hostname}/api/getproductsbyuserid_alt/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Authorization': `Bearer ${this.user.jwt}`
            }
        });

        const responseData = await response.json();

        this.getOtherProductArrayUser = responseData.result.slice();

        return this.getOtherProductArrayUser;
    }




    // home page //

    async getLastProductArrayResult() {

        await this.getLastProduct();

        this.getDivElementWidthCarousel();
    }







    // product page //

    async getOtherProductArrayUserResult(user_id: number) {

        await this.getProductsByUserIdAlt(user_id);

        this.getDivElementWidthCarousel();
    }






    getDivElementWidthCarousel() {

        const divLastProduct = (document.getElementsByClassName('section-home-last-product-div')[0] as HTMLDivElement);

        const carouselElementDiv = (divLastProduct.getElementsByClassName('section-home-last-product-div-anchor-div') as HTMLCollectionOf<HTMLDivElement>);

        let carouselElementDivWidth = null;




        let getDivElement = setInterval(() => {

            if (carouselElementDiv[0] !== undefined) {

                carouselElementDivWidth = carouselElementDiv[0].offsetWidth;


                // if carousel div element not undefined //
                
                this.autoPlayCarousel();

                clearInterval(getDivElement);
            }
        }, 25);
        
    }






    autoPlayCarousel() {

        const divLastProduct = (document.getElementsByClassName('section-home-last-product-div')[0] as HTMLDivElement);



        const divLastProductCarousel = (divLastProduct.getElementsByClassName('section-home-last-product-div-carousel')[0] as HTMLDivElement);

        const carouselElementDiv = (divLastProduct.getElementsByClassName('section-home-last-product-div-anchor-div') as HTMLCollectionOf<HTMLDivElement>);





        const gapMarginElement = Number(window.getComputedStyle(divLastProductCarousel).getPropertyValue('gap').replace('px', ''));

        

        this.intervalScrollCarousel = setInterval(() => {


            // if scroll limit => back to origin //

            if (Math.round(divLastProduct.scrollWidth - divLastProduct.scrollLeft) == divLastProduct.clientWidth) {

                divLastProduct.scrollTo({
                    top: 0,
                    left: -(divLastProduct.clientWidth + divLastProduct.scrollLeft),
                    behavior: 'smooth'
                });
            }


            // automatic scroll element width //

            else {

                divLastProduct.scrollTo({
                    top: 0,
                    left: (divLastProduct.scrollLeft + carouselElementDiv[0].offsetWidth + gapMarginElement),
                    behavior: 'smooth'
                })
            }
        }, 5000);
    }

    handleClickArrowCarouselHome(e: Event, direction: string) {


        if (this.timeoutScrollCarousel !== null) {

            clearTimeout(this.timeoutScrollCarousel);
        }



        if (this.intervalScrollCarousel !== null) {

            clearInterval(this.intervalScrollCarousel);

            this.timeoutScrollCarousel = setTimeout(() => {

                this.getDivElementWidthCarousel();
            }, 10000);
        }


        const divLastProduct = (document.getElementsByClassName('section-home-last-product-div')[0] as HTMLDivElement);

        const divLastProductCarousel = (divLastProduct.getElementsByClassName('section-home-last-product-div-carousel')[0] as HTMLDivElement);



        const carouselElementDiv = (document.getElementsByClassName('section-home-last-product-div-anchor-div') as HTMLCollectionOf<HTMLDivElement>);

        const gapMarginElement = Number(window.getComputedStyle(divLastProductCarousel).getPropertyValue('gap').replace('px', ''));



        if (direction == 'next') {

            divLastProduct.scrollTo({
                top: 0,
                left: (divLastProduct.scrollLeft + carouselElementDiv[0].offsetWidth + gapMarginElement),
                behavior: 'smooth'
            });
        }


        else if (direction == 'prev') {

            divLastProduct.scrollTo({
                top: 0,
                left: (divLastProduct.scrollLeft - carouselElementDiv[0].offsetWidth - gapMarginElement),
                behavior: 'smooth'
            });
        }
    }

    /*--- ---*/












    /*--- CLICK LOGO ---*/

    handleClickHomeLogo(e: Event) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);


        mainElement.classList.remove('blur');
        errorConfirmDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_error');
        errorDiv.classList.remove('active_success');


        if (this.timeoutRoute !== null) {

            clearTimeout(this.timeoutRoute);

            this.timeoutRoute = null;
        }


        this.router.navigate(['/']);
    }
}
