import { LightningElement } from 'lwc';
 export default class BoatSearch extends LightningElement {
    isLoading = false;
    
    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        this.isLoading = false;
    }
    
    // 1. pass event from another component:
    // This custom event comes from the boatSearchForm
    searchBoats(event) {
        let boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(boatTypeId);//pass id to search results
        // this.handleDoneLoading();
     }
    
     // 2. standard popup to create record:
     createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });        
    }
  }