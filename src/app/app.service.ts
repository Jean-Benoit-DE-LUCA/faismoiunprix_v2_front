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

    currentPageSearch = 0;

    searchResultKept: any = [];
    searchResultKeptSortOffer: any = [];





    newPostObject = {};

    objectNameFileUpdate = {};




    timeoutRoute: ReturnType<typeof setTimeout> | null = null;
    timeoutRouteTwo: ReturnType<typeof setTimeout> | null = null;
    timeoutRouteThree: ReturnType<typeof setTimeout> | null = null;
    timeoutRouteFour: ReturnType<typeof setTimeout> | null = null;

    intervalFetchMessage: ReturnType<typeof setInterval> | null = null;






    timeoutScrollCarousel: ReturnType<typeof setTimeout> | null = null;

    intervalScrollCarousel: ReturnType<typeof setInterval> | null = null;

    timeoutUserId: ReturnType<typeof setTimeout> | null = null;






    intervalCheckMessage: ReturnType<typeof setInterval> | null = null;
    intervalCheckMessageContact: ReturnType<typeof setInterval> | null = null;




    intervalExpireProduct: ReturnType<typeof setInterval> | null = null;






    timeoutLoader: ReturnType<typeof setTimeout> | null = null;






    messageContactNotRead: string = 'false';
    messageNotRead: string = 'false';







    getLastProductArray: any = [];

    getOtherProductArrayUser: any = [];

    

    getRandomProduct: any = [];


    offerSpecific: Array<any> = [];




    maxPage: boolean = false;



    constructor(private location: Location, public router: Router) {

        Object = Object;

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







        if (this.intervalExpireProduct !== null) {

            clearInterval(this.intervalExpireProduct);

            this.intervalExpireProduct = null;
        }


        this.location.back();




        this.inactiveLoader();
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
            console.log(window.location.pathname);


            // update envelope on row if route == /myoffer //

            if (this.messageNotRead && window.location.pathname == '/myoffer') {

                const rowOffers = (document.getElementsByClassName('table-myoffer-result-tbody-tr') as HTMLCollectionOf<HTMLTableRowElement>);

                

                // check every row to find the one to update envelope //

                const responseRowEnvelope = await fetch(`${this.hostname}/api/checkmessagerowenvelope`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${this.user.jwt}`
                    },
                    body: JSON.stringify({
                        userId: this.user.id
                    })
                });


                // return array of offer id to update envelope //

                const responseDataRowEnvelope = await responseRowEnvelope.json();

                console.log(responseDataRowEnvelope);



                // loop over each row //

                for (let i = 0; i < rowOffers.length; i++) {

                    const rowOfferToUpdate = rowOffers[i].getAttribute('data-offer-id');

                    for (let y = 0; y < responseDataRowEnvelope['result'].length; y++) {

                        if (responseDataRowEnvelope['result'][y] == rowOfferToUpdate) {

                            const rowOffersImageEnvelope = rowOffers[i].getElementsByClassName('img-envelope offer')[0];

                            rowOffersImageEnvelope.classList.add('active');
                        }
                    }
                    
                }
            }
        }, 300000/*10000*/);  // 5min
    }










    checkMessageContact() {

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

    async handleClickHomeLogo(e: Event) {

        e.preventDefault();

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);

        const divLoader = (document.getElementsByClassName('loader-div')[0] as HTMLDivElement);
        const footer = (document.getElementsByClassName('footer')[0] as HTMLElement);


        mainElement.classList.remove('blur');
        errorConfirmDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_confirm');
        errorDiv.classList.remove('active_error');
        errorDiv.classList.remove('active_success');







        if (this.timeoutRoute !== null) {

            
            clearTimeout(this.timeoutRoute);

            this.timeoutRoute = null;

            // GOOD BUT TO REVISE //

            // const intervalCheckActive = setInterval(() => {

            //     if (errorDiv.classList.contains('active_success')) {

            //         errorDiv.classList.remove('active_success');

            //         clearInterval(intervalCheckActive);
            //     }
            // }, 25);
        }

        if (this.timeoutRouteTwo !== null) {

            
            clearTimeout(this.timeoutRouteTwo);

            this.timeoutRouteTwo = null;
        }

        if (this.timeoutRouteThree !== null) {

            
            clearTimeout(this.timeoutRouteThree);

            this.timeoutRouteThree = null;
        }
        
        if (this.timeoutRouteFour !== null) {

            
            clearTimeout(this.timeoutRouteFour);

            this.timeoutRouteFour = null;
        }



        



        if (this.intervalExpireProduct !== null) {

            clearInterval(this.intervalExpireProduct);

            this.intervalExpireProduct = null;
        }






        const routeHome = await this.router.navigate(['/']);

        if (routeHome) {



            if (divLoader.classList.contains('on')) {

                mainElement.classList.remove('off');
                divLoader.classList.remove('on');
                divLoader.classList.add('off');
                footer.classList.remove('off');
            }

            else {

                this.checkLoader();
            }
        }
    }


    async checkLoader() {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const divLoader = (document.getElementsByClassName('loader-div')[0] as HTMLDivElement);
        const footer = (document.getElementsByClassName('footer')[0] as HTMLElement);

        return new Promise(resolve => {

            if (divLoader.classList.contains('on')) {

                mainElement.classList.remove('off');
                divLoader.classList.remove('on');
                divLoader.classList.add('off');
                footer.classList.remove('off');

                resolve(divLoader);
            }

            else if (!divLoader.classList.contains('on')) {

                setTimeout(() => {

                    this.checkLoader();
                }, 25);
                
            }
        });
    }












    /*--- ROUTER LINK ---*/

    handleClickProductLink(e: Event, product_id: number) {

        window.location.replace(`/product/${product_id}`);

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }























    productDataExpireTime: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number; 
    } = {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    };

    productExpireBoolean: boolean = false;

    /*--- GET REMAINING TIME ---*/

    getRemainingTimeProduct(product_created_at: string) {


        const currentDateTime = new Date
        (
            new Date(this.getCurrentDateTime()).getFullYear(),
            new Date(this.getCurrentDateTime()).getUTCMonth(),
            new Date(this.getCurrentDateTime()).getUTCDate(),
            new Date(this.getCurrentDateTime()).getHours(),
            new Date(this.getCurrentDateTime()).getMinutes(),
            new Date(this.getCurrentDateTime()).getSeconds()
        );

        const productCreatedAt = new Date
        (
            new Date(product_created_at).getFullYear(),
            new Date(product_created_at).getUTCMonth(),
            new Date(product_created_at).getUTCDate(),
            new Date(product_created_at).getHours(),
            new Date(product_created_at).getMinutes(),
            new Date(product_created_at).getSeconds()
        );





        // clone date + 14 days //

        const addDate = new Date(productCreatedAt);

        addDate.setDate(addDate.getDate() + 14);






        // day diff //

        const dayDiffBetween = Math.floor((Math.round(addDate.getTime() - currentDateTime.getTime())) / (1000 * 3600 * 24));



        // year diff //

        let yearDiffBetween = (addDate.getTime() - currentDateTime.getTime()) / 1000;
        yearDiffBetween = Math.abs(Math.round(yearDiffBetween / (60 * 60 * 24) / 365));





        // month diff between //

        const monthDiffBetween = Math.abs((addDate.getUTCMonth() - productCreatedAt.getUTCMonth() + 
                                 (12 * (addDate.getUTCFullYear() - productCreatedAt.getUTCFullYear()))) - 1);







        // hour diff //

        const hourDiffBetween = new Date(addDate.getTime() - currentDateTime.getTime()).getUTCHours();








        // minute diff between //

        const minuteDiffBetween = new Date(addDate.getTime() - currentDateTime.getTime()).getMinutes();









        // second diff between //

        const secondDiffBetween = new Date(addDate.getTime() - currentDateTime.getTime()).getSeconds();




        


        this.productDataExpireTime.day = dayDiffBetween;

        this.productDataExpireTime.month = monthDiffBetween;

        this.productDataExpireTime.year = yearDiffBetween;




        this.productDataExpireTime.hour = hourDiffBetween;

        this.productDataExpireTime.minute = minuteDiffBetween;

        this.productDataExpireTime.second = secondDiffBetween;






        // set boolean product expire //

        this.productExpireBoolean = addDate.getTime() < currentDateTime.getTime();

    }
















    /*--- ACTIVATE LOADER IF IN DOM ---*/

    activeLoader() {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const footerElement = (document.getElementsByClassName('footer')[0] as HTMLElement);
        const divLoader = (document.getElementsByClassName('loader-div')[0] as HTMLDivElement);


        return new Promise(resolve => {


            if (divLoader !== undefined) {

                if (!mainElement.classList.contains('off')) {

                    mainElement.classList.remove('on');
                    divLoader.classList.remove('off');
    
                    mainElement.classList.add('off');
                    footerElement.classList.add('off');
                    divLoader.classList.add('on');
                }
    
    
                // this.timeoutLoader = setTimeout(() => {
    
                //     if (mainElement.classList.contains('off')) {
    
                //         mainElement.classList.remove('off');
                //         footerElement.classList.remove('off');
                //         divLoader.classList.remove('on');
    
                //         mainElement.classList.add('on');
                //         divLoader.classList.add('off');
                //     }
                // }, 1000);

                resolve(divLoader);
            }

            else {

                setTimeout(() => {

                    this.activeLoader();
                }, 125);
            }
        });
    }














    /*--- DEACTIVATE LOADER IF IN DOM ---*/

    inactiveLoader() {

        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);
        const footerElement = (document.getElementsByClassName('footer')[0] as HTMLElement);
        const divLoader = (document.getElementsByClassName('loader-div')[0] as HTMLDivElement);


        return new Promise(resolve => {


            if (divLoader !== undefined) {


                mainElement.classList.remove('off');
                divLoader.classList.add('off');
                footerElement.classList.remove('off');

                resolve(divLoader);
            }

            else {

                setTimeout(() => {

                    this.inactiveLoader();
                }, 125);
            }
        });
    }





    windowScrollY: number = 0;

    /*--- SCROLL FILTER BOX ---*/

    scrollFilterBox() {

        

        const divFilterSort = (document.getElementsByClassName('section-search-filter-button-div')[0] as HTMLDivElement);
        const imgDivFilterSort = (document.getElementsByClassName('section-search-filter-img')[0] as HTMLImageElement);
        const spanResult = (document.getElementsByClassName('section-search-result-span')[0] as HTMLSpanElement);

        console.log(window.scrollY > this.windowScrollY);

        

        // check scroll position && if user scroll UP or DOWN //

        if (divFilterSort !== undefined) {

            if (window.scrollY > 30 && window.scrollY > this.windowScrollY) {

                console.log('>30');

                divFilterSort.classList.remove('inactive');
                divFilterSort.classList.add('active');

            }

            else if (window.scrollY <= 135 && window.scrollY <= this.windowScrollY) {

                console.log('<= 135');

                divFilterSort.classList.remove('active');
                divFilterSort.classList.add('inactive');
            }
        }




        this.windowScrollY = window.scrollY;
    }








    /*--- SCROLL LOAD DATA ---*/

    scrollLoadDataParameter = () => {


        if (window.location.pathname == '/search') {
            
            this.scrollLoadData('/search');
        }
    };





    scrollLoadData(route: string) {
        
        if (route == '/search') {


            // if user reaches the bottom page //

            if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight) {


            

                // if user made a search //

                if (this.searchResultKeptSortOffer.length > 0) {



                    // increment current page property //

                    this.currentPageSearch++;

                

                    console.log(this.searchResultKeptSortOffer);
                    this.handleKeyDownSearch(null);





                    // pause listener //

                    if (this.maxPage) {

                        window.removeEventListener('scroll', this.scrollLoadDataParameter);
                    }



                    else if (!this.maxPage) {

                        window.removeEventListener('scroll', this.scrollLoadDataParameter);

                        setTimeout(() => {

                            window.addEventListener('scroll', this.scrollLoadDataParameter);
                        }, 500);
                    }

                    // pause listener //

                }
                
            }
        }
    }










    /* ENTER PRESS BUTTON SEARCH BAR */

    async handleKeyDownSearch(e: KeyboardEvent | SubmitEvent | null = null) {



    
        const inputSearch = (document.getElementsByClassName('header-div-searchbar-div-input')[0] as HTMLInputElement);



        // instance of KeyboardEvent if user press Enter key to search OR if user click submit button in filter section => we pass event as SubmitEvent to execute this if block of code //

        if ((e instanceof KeyboardEvent && e !== null && e.key == 'Enter') ||
            (e instanceof SubmitEvent)) {


            // go to top of page before display result //

            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });




            // reset maxPage property && add scroll listener (is ON on first search because on search component constructor THEN if second search => activate it) ///

            this.currentPageSearch = 0;


            window.addEventListener('scroll', this.scrollLoadDataParameter);
            

            this.maxPage = false;

            //







            const routeSearch = await this.router.navigate(['/search']);

            if (routeSearch) {

                // activate loader //
                this.activeLoader();
                //
            }



            


            // INFINITE SCROLLING => ADD "&page= //

            const response = await fetch(`${this.hostname}/api/getproducts?search=${inputSearch.value}&page=${this.currentPageSearch}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });



            

            const responseData = await response.json();

            console.log(responseData);



            if (responseData.hasOwnProperty('result')) {

                this.inactiveLoader();
            }



            // timeout to delay result updating the DOM to prevent duplicate data fetch on scroll //

            setTimeout(() => {

                this.searchWord = inputSearch.value;

                this.searchResult = Object.assign({}, responseData.result);







                this.objectToArrayFunction(this.searchResult, true);


                this.filterResultFunction();
            }, 250);

            // this.searchWord = inputSearch.value;

            // this.searchResult = Object.assign({}, responseData.result);







            // this.objectToArrayFunction(this.searchResult);


            // this.filterResultFunction();
        }






        else if (e === null) {

            

            const routeSearch = await this.router.navigate(['/search']);

            if (routeSearch) {

                // activate loader //
                this.activeLoader();
                //
            }



            // INFINITE SCROLLING => ADD "&page= //

            const response = await fetch(`${this.hostname}/api/getproducts?search=${inputSearch.value}&page=${this.currentPageSearch}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });



            

            const responseData = await response.json();

            console.log(responseData);



            // if no more result => remove listener //

            if (responseData.hasOwnProperty('flag') && responseData.flag === false) {

                this.maxPage = true;

                window.removeEventListener('scroll', this.scrollLoadDataParameter);
            }



            else if (responseData.hasOwnProperty('result')) {

                this.inactiveLoader();

                this.searchWord = inputSearch.value;


                // get last index key in current searchResult //

                const indexKeys = Object.keys(this.searchResult).map( elem => Number(elem));

                let maxIndex = Math.max.apply(Math, indexKeys);

                //


                // console.log(maxIndex);

                




                // convert index key of responseData.result => start of maxIndex of previous result //

                // increment because index start at 0 //
                maxIndex++;

                const indexKeysNext = Object.keys(responseData.result).map(elem => maxIndex++);

                
                

                // copy current searchResult //

                const searchResultCopy: any = Object.assign({}, this.searchResult);

                // console.log(searchResultCopy);



                // add new search result to copy of current one //

                for (let i = 0; i < indexKeysNext.length; i++) {

                    searchResultCopy[indexKeysNext[i]] = responseData.result[i];
                }


                this.searchResult = Object.assign({}, searchResultCopy);
                



                // this.searchResult = Object.assign({}, responseData.result);

                // console.log(this.searchResult);





                // add boolean to reset or not this.searchResultKept && this.searchResultKeptSortOffer //

                this.objectToArrayFunction(this.searchResult);


                this.filterResultFunction();
            }




            
        }
    }



















    objectToArrayFunction(obj: any, reset: boolean = false) {

        console.log(obj);


        // !!RESET TO EMPTY ARRAY!! //


        // add reset to load only new cards and not previous ones if user scrolls //

        if (reset) {

            this.searchResultKept = [];
            this.searchResultKeptSortOffer = [];
        }

        

        



        for (const product of Object.keys(obj)) {

            this.searchResultKept.push(obj[product]);
        }






        for (const product of Object.keys(obj)) {


            const newObj: any = {};



            for (const key of Object.keys(obj[product])) {

                if (key !== 'offer') {

                    newObj[key] = obj[product][key];
                }

                else if (key == 'offer') {

                    newObj[key] = obj[product][key].slice().sort((a: any, b: any) => {

                        if (a.offer_created_at < b.offer_created_at) {
                            return 1;
                        }

                        else if (a.offer_created_at > b.offer_created_at) {
                            return -1;
                        }
                        return 0;
                    })
                }
            }

            this.searchResultKeptSortOffer.push(newObj);

        }




        // max offer //


        for (const product of Object.keys(obj)) {

            let product_user_id = obj[product]['product']['product_user_id'];



            let max_offer = 0;

            for (const offer of obj[product]['offer']) {

                if (offer.offer_user_offer !== product_user_id && offer.offer_offerprice >= max_offer ) {

                    max_offer = offer.offer_offerprice;
                }
            }


            this.searchResultKeptSortOffer[product]['max_offer'] = max_offer;
        }
    }









    async filterResultFunction() {

        const filterSection = (document.getElementsByClassName('section-search-filter-div')[0] as HTMLDivElement);

        const filterImg = (document.getElementsByClassName('section-search-filter-img')[0] as HTMLImageElement);

        const crossFilter = (document.getElementsByClassName('cross-filter')[0] as HTMLButtonElement);




        const radiusValue = [0, 10, 25, 50, 100, 150, 200];

        const city = (document.getElementsByClassName('search-filter-input-city')[0] as HTMLInputElement);
        const zip = (document.getElementsByClassName('search-filter-input-zip')[0] as HTMLInputElement);

        const radius = (document.getElementsByClassName('search-filter-input-radius')[0] as HTMLInputElement);

        const selectCategory = (document.getElementsByClassName('search-filter-select-category')[0] as HTMLSelectElement);

        const minOffer = (document.getElementById('search-filter-input-offer-min') as HTMLInputElement);
        const maxOffer = (document.getElementById('search-filter-input-offer-max') as HTMLInputElement);

        const deliveryInputRadio = (document.getElementsByName('search-filter-input-delivery') as NodeListOf<HTMLInputElement>);

        const newProductInputRadio = (document.getElementsByName('search-filter-input-new') as NodeListOf<HTMLInputElement>);




        if (filterSection !== undefined) {








            if (city.value.trim().length == 0 && zip.value.trim().length == 0) {

                console.log(minOffer.value);
                console.log(maxOffer.value);

                const minOfferFinal = minOffer.value;
                const maxOfferFinal = maxOffer.value;




                let delivery = null;

                for (let i = 0; i < deliveryInputRadio.length; i++) {

                    if (deliveryInputRadio[i].checked) {
        
                        delivery = (deliveryInputRadio[i].id.replace('search-filter-input-delivery-', ''));
                    }
                }






                let newProduct = null;

                for (let i = 0; i < newProductInputRadio.length; i++) {

                    if (newProductInputRadio[i].checked) {

                        newProduct = (newProductInputRadio[i].id.replace('search-filter-input-new-', ''));
                    }
                }










                //--- FILTER RESULT ---//


                if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal == '')) {


                    let result = this.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) > 0);



                    if (delivery == 'yes') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                    }

                    else if (delivery == 'no') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                    }

                    
                    




                    if (newProduct == 'yes') {

                        /* keep product -48h created */

                        result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                    }

                    else if (newProduct == 'no') {

                        result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                    }




                    this.searchResultKept = result.slice();

                    //
                    this.searchResultKeptSortOffer = result.slice();
                }







                
                if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {


                    let result = this.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));

                    console.log(result);




                    if (delivery == 'yes') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                    }

                    else if (delivery == 'no') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                    }

                    
                    




                    if (newProduct == 'yes') {

                        /* keep product -48h created */

                        result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                    }

                    else if (newProduct == 'no') {

                        result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                    }

                    this.searchResultKept = result.slice();

                    //
                    this.searchResultKeptSortOffer = result.slice();
                }











                if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length == 0)) {


                    if (!isNaN(Number(minOfferFinal.trim()))) {
    
    
                        let result = this.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()));
    
                        
                        if (delivery == 'yes') {
    
                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }
        
                        else if (delivery == 'no') {
        
                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }
        
                        
                        
        
        
        
        
                        if (newProduct == 'yes') {
        
                            /* keep product -48h created */
        
                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }
        
                        else if (newProduct == 'no') {
        
                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }
        
        
        
        
        
        
                        // category filter //
        
                        if (selectCategory.value !== 'all') {
        
                            result = result.filter((elem: any) => 
        
                                Number(elem.product.product_category_id) == Number(selectCategory.value)
                            );
                        }
        
        
        
        
                        this.searchResultKept = result.slice();
        
                        //
                        this.searchResultKeptSortOffer = result.slice();
                    }
    
                    else if (isNaN(Number(minOfferFinal.trim()))) {
    
                        minOffer.focus();
    
                        return;
                    }
    
    
                }
    
    
    
    
    
    
    
    
    
    
                if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length > 0)) {
    
    
                    if (!isNaN(Number(minOfferFinal.trim())) && !isNaN(Number(maxOfferFinal.trim()))) {
    
    
                        let result = this.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()) && Number(elem.offer[elem.offer.length - 1].offer_offerprice) < Number(maxOfferFinal.trim()));
    
                        console.log(result);
    
                        
                        if (delivery == 'yes') {
    
                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }
        
                        else if (delivery == 'no') {
        
                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }
        
                        
                        
        
        
        
        
                        if (newProduct == 'yes') {
        
                            /* keep product -48h created */
        
                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }
        
                        else if (newProduct == 'no') {
        
                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }
        
        
        
        
        
        
                        // category filter //
        
                        if (selectCategory.value !== 'all') {
        
                            result = result.filter((elem: any) => 
        
                                Number(elem.product.product_category_id) == Number(selectCategory.value)
                            );
                        }
        
        
        
        
                        this.searchResultKept = result.slice();
        
                        //
                        this.searchResultKeptSortOffer = result.slice();
                    }
    
                    else if (isNaN(Number(minOfferFinal.trim()))) {
    
                        minOffer.focus();
    
                        return;
                    }
    
                    else if (isNaN(Number(maxOfferFinal.trim()))) {
    
                        maxOffer.focus();
    
                        return;
                    }
    
    
                }











                if (filterSection.classList.contains('active')) {

                    crossFilter.click();
                }
            }









            /*--- EMPTY CITY INPUT BUT ZIP NOT EMPTY ---*/

            if (city.value.trim().length == 0) {

                if (zip.value.trim().length > 0) {

                    filterImg.click();

                    city.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                    city.placeholder = 'Ville';
                    city.focus();

                    filterSection.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }








            /*--- NOT EMPTY CITY ---*/

            if (city.value.trim().length > 0) {

                if (zip.value.trim().length == 0) {

                    filterImg.click();

                    zip.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--backgroundError');
                    zip.placeholder = 'Code postal';
                    zip.focus();

                    filterSection.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }

                else if (zip.value.trim().length > 0) {

                    
                    console.log(city.value);
                    console.log(zip.value);



                    let latitude = null;
                    let longitude = null;




                    // check if city in database //

                    const responseCheckCityDatabase = await fetch(`${this.hostname}/api/checkcity`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            city: city.value.trim(),
                            zip: zip.value.trim()
                        })
                    });

                    const responseDataCheckCityDatabase = await responseCheckCityDatabase.json();




                    // if city found in database //

                    if (responseDataCheckCityDatabase.checkCity.length > 0) {

                        console.log(responseDataCheckCityDatabase.checkCity[0]['latitude']);
                        console.log(responseDataCheckCityDatabase.checkCity[0]['longitude']);
                        console.log('FOUND!');

                        latitude = responseDataCheckCityDatabase.checkCity[0]['latitude'];
                        longitude = responseDataCheckCityDatabase.checkCity[0]['longitude'];
                    }



                    // if city NOT found in database //

                    else if (responseDataCheckCityDatabase.checkCity.length == 0) {

                        const responseCityCoordinatesBack = await fetch(`${this.hostname}/api/getcoordinates/city/${city.value.trim()}/zip/${zip.value.trim()}`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json'
                            }
                        });

                        const responseDataCityCoordinatesBack = await responseCityCoordinatesBack.json();

                        console.log(responseDataCityCoordinatesBack);

                        console.log('NOT FOUND!');

                        // get coordinates from city //

                        latitude = responseDataCityCoordinatesBack.latitude;
                        longitude = responseDataCityCoordinatesBack.longitude;






                        const responseCityInsert = await fetch(`${this.hostname}/api/insertcity`, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                city: city.value.trim(),
                                zip: zip.value.trim(),
                                latitude: latitude,
                                longitude: longitude
                            })
                        });

                        const responseDataCityInsert = await responseCityInsert.json();

                        console.log(responseDataCityInsert);
                    }












                    /*--- GET DISTANCE BETWEEN USER INPUT AND EACH PRODUCT ---*/

                    const responseDistance = await fetch(`${this.hostname}/api/getdistance`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            latitudeInput: latitude,
                            longitudeInput: longitude,
                            // radiusInput: radiusValue[Number(radius.value)]
                        })
                    })


                    const responseDataDistance = await responseDistance.json();

                    console.log(responseDataDistance);
                    console.log(this.searchResultKept);
                    console.log(radiusValue[Number(radius.value)]);







                    /*--- FILTER KEEP DISTANCE RESULT ONLY ---*/

                    const searchResultKeptDistanceFilter = [];

                    for (let i = 0; i < this.searchResultKept.length; i++) {



                        for (let y = 0; y < responseDataDistance.result.length; y++) {



                            if (this.searchResultKept[i].product.product_id == responseDataDistance.result[y].product_id) {

                                if (responseDataDistance.result[y].product_distance <= radiusValue[Number(radius.value)]) {

                                    searchResultKeptDistanceFilter.push(this.searchResultKept[i]);
                                }

                                break;
                            }
                        }
                    }



                    this.searchResultKept = searchResultKeptDistanceFilter.slice();

                    //
                    this.searchResultKeptSortOffer = searchResultKeptDistanceFilter.slice();






                    const minOfferFinal = minOffer.value;
                    const maxOfferFinal = maxOffer.value;




                    let delivery = null;

                    for (let i = 0; i < deliveryInputRadio.length; i++) {

                        if (deliveryInputRadio[i].checked) {
            
                            delivery = (deliveryInputRadio[i].id.replace('search-filter-input-delivery-', ''));
                        }
                    }






                    let newProduct = null;

                    for (let i = 0; i < newProductInputRadio.length; i++) {

                        if (newProductInputRadio[i].checked) {

                            newProduct = (newProductInputRadio[i].id.replace('search-filter-input-new-', ''));
                        }
                    }








                    //--- FILTER RESULT ---//


                    if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal == '')) {


                        let result = this.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) > 0);



                        if (delivery == 'yes') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }

                        else if (delivery == 'no') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }

                        
                        


                       

                        if (newProduct == 'yes') {

                            // keep product -48h created

                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }

                        else if (newProduct == 'no') {

                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }




                        this.searchResultKept = result.slice();

                        //
                        this.searchResultKeptSortOffer = result.slice();
                    }







                    
                    if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {


                        let result = this.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));

                        console.log(result);




                        if (delivery == 'yes') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }

                        else if (delivery == 'no') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }

                        
                        




                        if (newProduct == 'yes') {

                            /* keep product -48h created */

                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }

                        else if (newProduct == 'no') {

                            result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }

                        this.searchResultKept = result.slice();

                        //
                        this.searchResultKeptSortOffer = result.slice();
                    }












                    if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length == 0)) {


                        if (!isNaN(Number(minOfferFinal.trim()))) {
        
        
                            let result = this.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()));
        
                            
                            if (delivery == 'yes') {
        
                                result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                            }
            
                            else if (delivery == 'no') {
            
                                result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                            }
            
                            
                            
            
            
            
            
                            if (newProduct == 'yes') {
            
                                /* keep product -48h created */
            
                                result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                            }
            
                            else if (newProduct == 'no') {
            
                                result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                            }
            
            
            
            
            
            
                            // category filter //
            
                            if (selectCategory.value !== 'all') {
            
                                result = result.filter((elem: any) => 
            
                                    Number(elem.product.product_category_id) == Number(selectCategory.value)
                                );
                            }
            
            
            
            
                            this.searchResultKept = result.slice();
            
                            //
                            this.searchResultKeptSortOffer = result.slice();
                        }
        
                        else if (isNaN(Number(minOfferFinal.trim()))) {
        
                            minOffer.focus();
        
                            return;
                        }
        
        
                    }
        
        
        
        
        
        
        
        
        
        
                    if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length > 0)) {
        
        
                        if (!isNaN(Number(minOfferFinal.trim())) && !isNaN(Number(maxOfferFinal.trim()))) {
        
        
                            let result = this.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()) && Number(elem.offer[elem.offer.length - 1].offer_offerprice) < Number(maxOfferFinal.trim()));
        
                            console.log(result);
        
                            
                            if (delivery == 'yes') {
        
                                result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                            }
            
                            else if (delivery == 'no') {
            
                                result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                            }
            
                            
                            
            
            
            
            
                            if (newProduct == 'yes') {
            
                                /* keep product -48h created */
            
                                result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                            }
            
                            else if (newProduct == 'no') {
            
                                result = result.filter((elem: any) => ((new Date(this.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                            }
            
            
            
            
            
            
                            // category filter //
            
                            if (selectCategory.value !== 'all') {
            
                                result = result.filter((elem: any) => 
            
                                    Number(elem.product.product_category_id) == Number(selectCategory.value)
                                );
                            }
            
            
            
            
                            this.searchResultKept = result.slice();
            
                            //
                            this.searchResultKeptSortOffer = result.slice();
                        }
        
                        else if (isNaN(Number(minOfferFinal.trim()))) {
        
                            minOffer.focus();
        
                            return;
                        }
        
                        else if (isNaN(Number(maxOfferFinal.trim()))) {
        
                            maxOffer.focus();
        
                            return;
                        }
        
        
                    }












                    if (filterSection.classList.contains('active')) {

                        crossFilter.click();
                    }
                }
            }






            for (const product of this.searchResultKeptSortOffer) {

                product['offer'] = product['offer'].slice().sort((a: any, b: any) => {

                    if (a.offer_created_at < b.offer_created_at) {
                        return 1;
                    }

                    else if (a.offer_created_at > b.offer_created_at) {
                        return -1;
                    }
                    return 0;
                })
            }

            



            for (const product of this.searchResultKeptSortOffer) {

                let product_user_id = product['product']['product_user_id'];



                let max_offer = 0;

                for (const offer of product['offer']) {

                    if (offer.offer_user_offer !== product_user_id && offer.offer_offerprice >= max_offer ) {

                        max_offer = offer.offer_offerprice;
                    }
                }


                product['max_offer'] = max_offer;
            }




            console.log(this.searchResultKeptSortOffer);
            console.log(this.searchResultKept);











            // REMOVE DUPLICATE //

            
            // TODO => REVISE ALGORYTHM

            // get product_id in current searchResultKept //
            const arrayProductId = [];

            for (let i = 0; i < this.searchResultKeptSortOffer.length; i++) {

                arrayProductId.push(this.searchResultKeptSortOffer[i].product.product_id);
            }

            

            



            // add new property of each product_id in new object //
            const objDuplicate = {};

            for (let i = 0; i < arrayProductId.length; i++) {

                Object.defineProperty(objDuplicate, arrayProductId[i], {
                    value: 0,
                    writable: true,
                    enumerable: true
                });
            }

            

            console.log(objDuplicate);



            // for each product_id found in arrayProductId => increment to get duplicate ones //
            for (let i = 0; i < arrayProductId.length; i++) {

                (objDuplicate as any)[arrayProductId[i]]++;
            }

            console.log(objDuplicate);

            


            

            for (let i = this.searchResultKeptSortOffer.length - 1; i >= 0; i--) {

                

                if (this.searchResultKeptSortOffer[i] !== undefined && (objDuplicate as any)[this.searchResultKeptSortOffer[i].product.product_id] > 1) {


                    (objDuplicate as any)[this.searchResultKeptSortOffer[i].product.product_id]--;

                    this.searchResultKeptSortOffer.splice(this.searchResultKeptSortOffer.indexOf(this.searchResultKeptSortOffer[i]), 1);
                }

            }
        }
    }

















    /*--- BACK TOP PAGE ---*/

    handleClickArrowBackTop(e: Event) {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
