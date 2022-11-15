import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';

export default class BoostQuerySelector extends LightningElement {
    @track sobjects;
    @track allValues = [];

    queryString;
    sObjectString;

    connectedCallback() {
        this.isLoading = true;
        this.getAllCustomSObjects();
    }

    get query() {
        return this.queryString;
    }

    set query(value) {
        this.queryString = 'SELECT ' + value;
    }

    getAllCustomSObjects() {
        getAllCustomSObjects({})
        .then((result) => {
            if (result) {
                this.sobjects = result;
                this.error = undefined;
            }
        }).catch((error) => {
            this.error = error.message;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    onSobjectChange(event) {
        this.allValues = [];
        this.value = '';
        let sObjectName = event.target.value;
        this.query = sObjectName;
        this.sObjectString = sObjectName;
        console.log('this.sObjectString: ' + this.sObjectString);
    }
}