import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule,
              RouterModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})

export class SearchComponent {

    constructor(public appService: AppService, private router: Router) {

        this.appService.manageInterval();

        this.objectToArrayFunction(this.appService.searchResult);
    }

    handleClickFilter(e: MouseEvent, button_action: string) {

        e.preventDefault();


        if (button_action == 'filter') {

            const divFilter = (document.getElementsByClassName('section-search-filter-div')[0] as HTMLDivElement);
            
            divFilter.classList.toggle('active');
        }



        else if (button_action == 'sort') {

            const divSort = (document.getElementsByClassName('section-search-sort-div')[0] as HTMLDivElement);

            divSort.classList.toggle('active');
        }
    }





    handleInputRangeRadius(e?: any) {

        const radius = (document.getElementsByClassName('search-filter-input-radius')[0] as HTMLInputElement);
        const spanInputRangeValue = (document.getElementsByClassName('search-filter-input-radius-span')[0] as HTMLSpanElement);

        switch(radius.value) {

            case '0':

                spanInputRangeValue.innerHTML = '0km';
                break;

            case '1':

                spanInputRangeValue.innerHTML = '10kms';
                break;

            case '2':

                spanInputRangeValue.innerHTML = '25kms';
                break;

            case '3':

                spanInputRangeValue.innerHTML = '50kms';
                break;

            case '4':

                spanInputRangeValue.innerHTML = '100kms';
                break;

            case '5':

                spanInputRangeValue.innerHTML = '150kms';
                break;

            case '6':

                spanInputRangeValue.innerHTML = '200kms';
                break;

            default:

                spanInputRangeValue.innerHTML = '0km';
        }
        
    }









    async handleSubmitFilter(e: SubmitEvent) {

        e.preventDefault();



        const filterSection = (document.getElementsByClassName('section-search-filter-div')[0] as HTMLDivElement);

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







        await this.handleKeyDownSearch();






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







            
            if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {



                let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));




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





            crossFilter.click();
        }









        /*--- EMPTY CITY INPUT BUT ZIP NOT EMPTY ---*/

        if (city.value.trim().length == 0) {

            if (zip.value.trim().length > 0) {



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

                    console.log('NOT FOUND!');



                    // get coordinates from city //

                    const responseCityCoordinatesBack = await fetch(`${this.appService.hostname}/api/getcoordinates/city/${city.value.trim()}/zip/${zip.value.trim()}`, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    });

                    const responseDataCityCoordinatesBack = await responseCityCoordinatesBack.json();

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
                        longitudeInput: longitude
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







                
                if ((minOfferFinal == '' || minOfferFinal == '0') && (maxOfferFinal.trim().length > 0)) {


                    

                    let result = this.appService.searchResultKeptSortOffer.filter((elem: any) => elem.offer[elem.offer.length - 1].offer_offerprice == null || Number(elem.offer[elem.offer.length - 1].offer_offerprice) <= Number(maxOfferFinal.trim()));




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





                crossFilter.click();


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








    async handleKeyDownSearch() {

        const inputSearch = (document.getElementsByClassName('header-div-searchbar-div-input')[0] as HTMLInputElement);

        

        const response = await fetch(`${this.appService.hostname}/api/getproducts?search=${inputSearch.value}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        const responseData = await response.json();







        this.appService.searchWord = inputSearch.value;

        this.appService.searchResult = Object.assign({}, responseData.result);






        this.objectToArrayFunction(this.appService.searchResult);
        
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


        console.log(this.appService.searchResultKept);
        console.log(this.appService.searchResultKeptSortOffer);
    }
















    handleClickResetFilter(e: Event) {

        e.preventDefault();

        console.log(e.currentTarget);

        const city = (document.getElementsByClassName('search-filter-input-city')[0] as HTMLInputElement);
        const zip = (document.getElementsByClassName('search-filter-input-zip')[0] as HTMLInputElement);

        const radius = (document.getElementsByClassName('search-filter-input-radius')[0] as HTMLInputElement);



        const selectCategory = (document.getElementsByClassName('search-filter-select-category')[0] as HTMLSelectElement);


        const minOffer = (document.getElementById('search-filter-input-offer-min') as HTMLInputElement);
        const maxOffer = (document.getElementById('search-filter-input-offer-max') as HTMLInputElement);

        const deliveryInputRadio = (document.getElementsByName('search-filter-input-delivery') as NodeListOf<HTMLInputElement>);

        const newProductInputRadio = (document.getElementsByName('search-filter-input-new') as NodeListOf<HTMLInputElement>);





        city.value = '';
        zip.value = '';
        radius.value = '0';
        selectCategory.value = 'all';
        this.handleInputRangeRadius();
        minOffer.value = '';
        maxOffer.value = '';





        for (let i = 0; i < deliveryInputRadio.length; i++) {

            if (deliveryInputRadio[i].id.replace('search-filter-input-delivery-', '') == 'all') {

                deliveryInputRadio[i].checked = true;
            }
        }



        for (let i = 0; i < newProductInputRadio.length; i++) {

            if (newProductInputRadio[i].id.replace('search-filter-input-new-', '') == 'all') {

                newProductInputRadio[i].checked = true;
            }
        }
    }












    handleChangeInputRadioSort(e: Event) {

        e.preventDefault();

        const sortChoice = (e.currentTarget as HTMLInputElement).value;
        
        let result: any = [];




        // if search result have more than or equal to 1 result //

        if (this.appService.searchResultKeptSortOffer.length > 0) {


            if (sortChoice == 'old') {

                // sort old first //

                result = this.appService.searchResultKeptSortOffer.sort((a: any, b: any) => {

                    if (a.product.product_created_at > b.product.product_created_at) {

                        return 1;
                    }

                    else if (a.product.product_created_at < b.product.product_created_at) {

                        return -1;
                    }

                    return 0;
                });
            }






            else if (sortChoice == 'new') {

                // sort new first //

                result = this.appService.searchResultKeptSortOffer.sort((a: any, b: any) => {

                    if (a.product.product_created_at < b.product.product_created_at) {

                        return 1;
                    }

                    else if (a.product.product_created_at > b.product.product_created_at) {

                        return -1;
                    }

                    return 0;
                });
            }





            else if (sortChoice == 'cheap') {

                // sort cheap offer first //

                result = this.appService.searchResultKeptSortOffer.sort((a: any, b: any) => {

                    if (a.offer[a.offer.length - 1].offer_offerprice > b.offer[b.offer.length - 1].offer_offerprice) {

                        return 1;
                    }

                    else if (a.offer[a.offer.length - 1].offer_offerprice < b.offer[b.offer.length - 1].offer_offerprice) {

                        return -1;
                    }

                    return 0;
                });
            }









            else if (sortChoice == 'expensive') {

                // sort cheap offer first //

                result = this.appService.searchResultKeptSortOffer.sort((a: any, b: any) => {

                    if (a.offer[a.offer.length - 1].offer_offerprice < b.offer[b.offer.length - 1].offer_offerprice) {

                        return 1;
                    }

                    else if (a.offer[a.offer.length - 1].offer_offerprice > b.offer[b.offer.length - 1].offer_offerprice) {

                        return -1;
                    }

                    return 0;
                });
            }




            this.appService.searchResultKeptSortOffer = result;

            console.log(this.appService.searchResultKeptSortOffer);
        }
    }


}
