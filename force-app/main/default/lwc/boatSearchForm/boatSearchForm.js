import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes'; //#1 method from APEX

export default class BoatSearchForm extends LightningElement {

    selectedBoatTypeId = '';
    error = undefined;
    @track searchOptions;
    
    // fill boat types:
    @wire(getBoatTypes)//#2 method from APEX
    boatTypes({ error, data }) {
        if (data) {
            this.searchOptions = data.map(type => {
                return {
                    label : type.Name,//save to lightning-combox element
                    value : type.Id
                }
            });
            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } 
        else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }
    
    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.detail.value; 
        const searchEvent = new CustomEvent('search', {//create new event, register event by attribute onSearch (on + name)
            detail: {
                boatTypeId: this.selectedBoatTypeId
            }
        });
        this.dispatchEvent(searchEvent);
    }
}