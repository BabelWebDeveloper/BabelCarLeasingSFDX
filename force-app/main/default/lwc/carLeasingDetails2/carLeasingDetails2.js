import {wire, track, LightningElement} from 'lwc';

import {subscribe, MessageContext} from 'lightning/messageService';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';

export default class CarLeasingDetails2 extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext;

    @track
    car;

    @track currentPageReference;
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }

    get recordId() {
        return this.currentPageReference?.state?.c__recordId;
    }

    get objectType() {
        return this.currentPageReference?.state?.c__objectType;
    }

    get countParam() {
        return this.currentPageReference?.state?.c__randomCountParam;
    }

    // Navigates to app page on button click
    handleNavigate() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'AccountsAppPageName',
            },
            state: {
                c__recordId: '001B000001KGVlCIAX',
                c__objectType: 'Account',
                c__randomCountParam: 3
            }
        });
    }
}