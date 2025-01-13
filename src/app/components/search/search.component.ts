import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule,
              RouterModule,
              LoaderComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})

export class SearchComponent {





    constructor(public appService: AppService, private router: Router) {

        //this.appService.inactiveLoader();

        this.appService.manageInterval();

        this.appService.objectToArrayFunction(this.appService.searchResult, true);




        // INFINITE SCROLLING => scroll listener infinite scrolling //



        window.addEventListener('scroll', this.appService.scrollLoadDataParameter);

        // INFINITE SCROLLING //



        this.checkVisibility();
        

    }

    checkVisibility() {

        

        let timerInterval = setInterval(() => {

            const divFilterSort = (document.getElementsByClassName('section-search-filter-button-div')[0] as HTMLDivElement);

            if (typeof divFilterSort !== undefined) {

                clearInterval(timerInterval);

                scrollDetection(divFilterSort);
            }
        }, 50);






        



        

        const scrollDetection = (element: HTMLElement) => {

            window.addEventListener('scroll', this.appService.scrollFilterBox);
        };
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





        await this.appService.activeLoader();



        // e as argument => method accept e as instance of KeyboardEvent or SubmitEvent //
        this.appService.handleKeyDownSearch(e);
    }









    handleClickResetFilter(e: Event) {

        e.preventDefault();

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
        }
    }


}
