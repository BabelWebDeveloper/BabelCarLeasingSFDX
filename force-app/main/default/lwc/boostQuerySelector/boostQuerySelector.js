import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';

export default class BoostQuerySelector extends LightningElement {
    @track sobjects;
    @track allValues = [];
    @track advancedMode = true;
    @track progressValue;

    queryString = 'SELECT ';
    sObjectString;

    connectedCallback() {
        this.isLoading = true;
        this.getAllCustomSObjects();
    }

    handleTodoChange(event) {
        this.advancedMode = event.target.checked;
    }

    handleSoql(event){
        console.log(event.target.value);
        this.sObjectString = event.target.value;
    }

    get query() {
        return this.queryString;
    }

    set query(value) {
        this.queryString = value;
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
        this.sObjectString = sObjectName;
        console.log('this.sObjectString: ' + this.sObjectString);
    }

    hanldeProgressValueChange(event) {
        this.progressValue = event.detail;
        console.log('parent: ' + this.progressValue);
    }
}