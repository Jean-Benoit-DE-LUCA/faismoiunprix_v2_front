import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppService } from '../../app.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})

export class HeaderComponent {


    constructor(private router: Router, public appService: AppService) {
        
    }



    /* CLICK MENU */

    handleClickMenu(e: MouseEvent | undefined) {


        const mainElement = (document.getElementsByClassName('main')[0] as HTMLElement);

        const errorDiv = (document.getElementsByClassName('error-div')[0] as HTMLDivElement);
        const errorDivSpan = (document.getElementsByClassName('error-div-span')[0] as HTMLSpanElement);
        const errorConfirmDiv = (document.getElementsByClassName('error-div-confirm-div')[0] as HTMLDivElement);


        if (this.appService.timeoutRoute !== null) {


            errorConfirmDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_confirm');
            errorDiv.classList.remove('active_error');
            errorDiv.classList.remove('active_success');
            mainElement.classList.remove('blur');

            clearTimeout(this.appService.timeoutRoute);

            this.appService.timeoutRoute = null;
        }





        // DONE //

        // TODO => manage this condition TO DON'T STOP ON CLICK ! //

        // if (this.appService.intervalFetchMessage !== null) {

        //     clearInterval(this.appService.intervalFetchMessage);

        //     this.appService.intervalFetchMessage = null;
        // }








        






        const nav = (document.getElementsByClassName('nav')[0] as HTMLElement);
        const menuBar = (document.getElementsByClassName('header-div-menu-div-span-bar') as HTMLCollectionOf<HTMLSpanElement>);

        for (let i = 0; i < menuBar.length; i++) {

            menuBar[i].classList.toggle('active');
        }





        if (menuBar[0].classList.contains('active')) {

            nav.classList.add('active');
        }

        else {

            nav.classList.remove('active');
        }
    }










    /* CLICK ANCHOR MENU */

    handleClickAnchorMenu(e: MouseEvent) {



        const nameLinkMenu = ((e.currentTarget as HTMLAnchorElement).getElementsByClassName('nav-ul-a-li')[0] as HTMLLIElement).textContent?.trim();




        if (nameLinkMenu !== 'Accueil') {

            if (this.appService.timeoutScrollCarousel !== null) {

                clearTimeout(this.appService.timeoutScrollCarousel);

                this.appService.timeoutScrollCarousel == null;
            }
        }


        this.handleClickMenu(undefined);
    }





    /* ENTER PRESS BUTTON SEARCH BAR */

    async handleKeyDownSearch(e: KeyboardEvent) {

        const inputSearch = (document.getElementsByClassName('header-div-searchbar-div-input')[0] as HTMLInputElement);

        if (e.key == 'Enter') {

            const response = await fetch(`${this.appService.hostname}/api/getproducts?search=${inputSearch.value}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });

            const responseData = await response.json();


            console.log(responseData);




            this.appService.searchWord = inputSearch.value;

            this.appService.searchResult = Object.assign({}, responseData.result);







            this.objectToArrayFunction(this.appService.searchResult);


            this.filterResultFunction();





            /* keep not null result to loop over */

            this.router.navigate(['/search']);
        }
    }







    objectToArrayFunction(obj: any) {


        // !!RESET TO EMPTY ARRAY!! //

        this.appService.searchResultKept = [];
        this.appService.searchResultKeptSortOffer = [];



        for (const product of Object.keys(obj)) {

            this.appService.searchResultKept.push(obj[product]);
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

            this.appService.searchResultKeptSortOffer.push(newObj);

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


            this.appService.searchResultKeptSortOffer[product]['max_offer'] = max_offer;
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


                    let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) > 0);



                    if (delivery == 'yes') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                    }

                    else if (delivery == 'no') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                    }

                    
                    




                    if (newProduct == 'yes') {

                        /* keep product -48h created */

                        result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                    }

                    else if (newProduct == 'no') {

                        result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                    }




                    this.appService.searchResultKept = result.slice();

                    //
                    this.appService.searchResultKeptSortOffer = result.slice();
                }







                
                if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {


                    let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));

                    console.log(result);




                    if (delivery == 'yes') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                    }

                    else if (delivery == 'no') {

                        result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                    }

                    
                    




                    if (newProduct == 'yes') {

                        /* keep product -48h created */

                        result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                    }

                    else if (newProduct == 'no') {

                        result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                    }

                    this.appService.searchResultKept = result.slice();

                    //
                    this.appService.searchResultKeptSortOffer = result.slice();
                }











                if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length == 0)) {


                    if (!isNaN(Number(minOfferFinal.trim()))) {
    
    
                        let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()));
    
                        
                        if (delivery == 'yes') {
    
                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }
        
                        else if (delivery == 'no') {
        
                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }
        
                        
                        
        
        
        
        
                        if (newProduct == 'yes') {
        
                            /* keep product -48h created */
        
                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }
        
                        else if (newProduct == 'no') {
        
                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }
        
        
        
        
        
        
                        // category filter //
        
                        if (selectCategory.value !== 'all') {
        
                            result = result.filter((elem: any) => 
        
                                Number(elem.product.product_category_id) == Number(selectCategory.value)
                            );
                        }
        
        
        
        
                        this.appService.searchResultKept = result.slice();
        
                        //
                        this.appService.searchResultKeptSortOffer = result.slice();
                    }
    
                    else if (isNaN(Number(minOfferFinal.trim()))) {
    
                        minOffer.focus();
    
                        return;
                    }
    
    
                }
    
    
    
    
    
    
    
    
    
    
                if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length > 0)) {
    
    
                    if (!isNaN(Number(minOfferFinal.trim())) && !isNaN(Number(maxOfferFinal.trim()))) {
    
    
                        let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()) && Number(elem.offer[elem.offer.length - 1].offer_offerprice) < Number(maxOfferFinal.trim()));
    
                        console.log(result);
    
                        
                        if (delivery == 'yes') {
    
                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }
        
                        else if (delivery == 'no') {
        
                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }
        
                        
                        
        
        
        
        
                        if (newProduct == 'yes') {
        
                            /* keep product -48h created */
        
                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }
        
                        else if (newProduct == 'no') {
        
                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }
        
        
        
        
        
        
                        // category filter //
        
                        if (selectCategory.value !== 'all') {
        
                            result = result.filter((elem: any) => 
        
                                Number(elem.product.product_category_id) == Number(selectCategory.value)
                            );
                        }
        
        
        
        
                        this.appService.searchResultKept = result.slice();
        
                        //
                        this.appService.searchResultKeptSortOffer = result.slice();
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

                    const responseCheckCityDatabase = await fetch(`${this.appService.hostname}/api/checkcity`, {
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

                        const responseCityCoordinatesBack = await fetch(`${this.appService.hostname}/api/getcoordinates/city/${city.value.trim()}/zip/${zip.value.trim()}`, {
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






                        const responseCityInsert = await fetch(`${this.appService.hostname}/api/insertcity`, {
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

                    const responseDistance = await fetch(`${this.appService.hostname}/api/getdistance`, {
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
                    console.log(this.appService.searchResultKept);
                    console.log(radiusValue[Number(radius.value)]);







                    /*--- FILTER KEEP DISTANCE RESULT ONLY ---*/

                    const searchResultKeptDistanceFilter = [];

                    for (let i = 0; i < this.appService.searchResultKept.length; i++) {



                        for (let y = 0; y < responseDataDistance.result.length; y++) {



                            if (this.appService.searchResultKept[i].product.product_id == responseDataDistance.result[y].product_id) {

                                if (responseDataDistance.result[y].product_distance <= radiusValue[Number(radius.value)]) {

                                    searchResultKeptDistanceFilter.push(this.appService.searchResultKept[i]);
                                }

                                break;
                            }
                        }
                    }



                    this.appService.searchResultKept = searchResultKeptDistanceFilter.slice();

                    //
                    this.appService.searchResultKeptSortOffer = searchResultKeptDistanceFilter.slice();






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


                        let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) > 0);



                        if (delivery == 'yes') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }

                        else if (delivery == 'no') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }

                        
                        


                       

                        if (newProduct == 'yes') {

                            // keep product -48h created

                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }

                        else if (newProduct == 'no') {

                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }




                        this.appService.searchResultKept = result.slice();

                        //
                        this.appService.searchResultKeptSortOffer = result.slice();
                    }







                    
                    if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {


                        let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));

                        console.log(result);




                        if (delivery == 'yes') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                        }

                        else if (delivery == 'no') {

                            result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                        }

                        
                        




                        if (newProduct == 'yes') {

                            /* keep product -48h created */

                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                        }

                        else if (newProduct == 'no') {

                            result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                        }

                        this.appService.searchResultKept = result.slice();

                        //
                        this.appService.searchResultKeptSortOffer = result.slice();
                    }












                    if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length == 0)) {


                        if (!isNaN(Number(minOfferFinal.trim()))) {
        
        
                            let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()));
        
                            
                            if (delivery == 'yes') {
        
                                result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                            }
            
                            else if (delivery == 'no') {
            
                                result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                            }
            
                            
                            
            
            
            
            
                            if (newProduct == 'yes') {
            
                                /* keep product -48h created */
            
                                result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                            }
            
                            else if (newProduct == 'no') {
            
                                result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                            }
            
            
            
            
            
            
                            // category filter //
            
                            if (selectCategory.value !== 'all') {
            
                                result = result.filter((elem: any) => 
            
                                    Number(elem.product.product_category_id) == Number(selectCategory.value)
                                );
                            }
            
            
            
            
                            this.appService.searchResultKept = result.slice();
            
                            //
                            this.appService.searchResultKeptSortOffer = result.slice();
                        }
        
                        else if (isNaN(Number(minOfferFinal.trim()))) {
        
                            minOffer.focus();
        
                            return;
                        }
        
        
                    }
        
        
        
        
        
        
        
        
        
        
                    if ((minOfferFinal.trim().length > 0) && (maxOfferFinal.trim().length > 0)) {
        
        
                        if (!isNaN(Number(minOfferFinal.trim())) && !isNaN(Number(maxOfferFinal.trim()))) {
        
        
                            let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => Number(elem.offer[elem.offer.length - 1].offer_offerprice) >= Number(minOfferFinal.trim()) && Number(elem.offer[elem.offer.length - 1].offer_offerprice) < Number(maxOfferFinal.trim()));
        
                            console.log(result);
        
                            
                            if (delivery == 'yes') {
        
                                result = result.filter((elem: any) => elem.product.product_delivery == 'true');
                            }
            
                            else if (delivery == 'no') {
            
                                result = result.filter((elem: any) => elem.product.product_delivery == 'false');
                            }
            
                            
                            
            
            
            
            
                            if (newProduct == 'yes') {
            
                                /* keep product -48h created */
            
                                result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) <= 172800000 /* 48h */);
                            }
            
                            else if (newProduct == 'no') {
            
                                result = result.filter((elem: any) => ((new Date(this.appService.getCurrentDateTime()).getTime() - new Date(elem.product.product_created_at).getTime())) > 172800000 /* 48h */);
                            }
            
            
            
            
            
            
                            // category filter //
            
                            if (selectCategory.value !== 'all') {
            
                                result = result.filter((elem: any) => 
            
                                    Number(elem.product.product_category_id) == Number(selectCategory.value)
                                );
                            }
            
            
            
            
                            this.appService.searchResultKept = result.slice();
            
                            //
                            this.appService.searchResultKeptSortOffer = result.slice();
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






            for (const product of this.appService.searchResultKeptSortOffer) {

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

            



            for (const product of this.appService.searchResultKeptSortOffer) {

                let product_user_id = product['product']['product_user_id'];



                let max_offer = 0;

                for (const offer of product['offer']) {

                    if (offer.offer_user_offer !== product_user_id && offer.offer_offerprice >= max_offer ) {

                        max_offer = offer.offer_offerprice;
                    }
                }


                product['max_offer'] = max_offer;
            }




            console.log(this.appService.searchResultKeptSortOffer);
        }
    }
}
