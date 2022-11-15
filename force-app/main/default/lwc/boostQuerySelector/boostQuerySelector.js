import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';

export default class BoostQuerySelector extends LightningElement {
    @track sobjects;
    @track allValues = [];
    @track advancedMode = true;
    @track progressValue;

    queryString = 'SELECT ';
    queryFields;
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
        this.queryString = 'SELECT ';
        if (value !== null || value !== '') {
            this.queryString += value;
            this.queryString += ' FROM ' + this.sObjectString;
        }
        
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
    }

    hanldeQueryFieldsChange(event) {
        let fields = event.detail;
        let formattedFieldsSplit = fields.split(',');
        if (formattedFieldsSplit[0] !== '') {
            this.query = fields;
        } else {
            this.queryString = 'SELECT ';
        }
    }
}