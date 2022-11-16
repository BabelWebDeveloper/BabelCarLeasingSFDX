import { LightningElement, track, api, wire } from 'lwc';
import getObjects from '@salesforce/apex/BoostFieldSelectorController.getObjects';

export default class BoostQuerySelector extends LightningElement {
    @track sobjects;
    @track allValues = [];
    @track advancedMode = true;
    @track progressValue;

    inputQuery;
    queryString = 'SELECT ';
    queryFields;
    sObjectString;

    connectedCallback() {
        this.isLoading = true;
        this.getObjects();
    }

    handleTodoChange(event) {
        this.advancedMode = event.target.checked;
        if (this.advancedMode === true) {
            
        } else {
            console.log('false');
        }
    }

    handleSoql(event){
        this.inputQuery = event.target.value;
        this.checkQuery();
    }

    checkQuery(){
        let startIndex = 6;
        let endIndex = this.inputQuery.indexOf("FROM", 5);
        let objectFieldsString = [];
        let fields = this.inputQuery.slice(startIndex, endIndex);
        let formattedFields = fields.replace(/,/g, '');
        let formattedFieldsSplit = formattedFields.split(' ');

        formattedFieldsSplit.shift();
        formattedFieldsSplit.pop();
        formattedFieldsSplit.forEach((word) => {
            objectFieldsString.push(word);
        })

        const split = this.inputQuery.split(' ')
        let objectString;
        for(let i = 0; i < split.length; i++){
            if(split[i] === 'FROM'){
                objectString = split[i + 1];
            }
        }
        console.log('objectString: ' + objectString);
        console.log('objectFieldsString: ' + objectFieldsString);
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

    getObjects() {
        getObjects({})
        .then((result) => {
            if (result) {
                this.sobjects = result;
                this._objectFields = result;
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

    value;

    handleChange(event) {
        let objectName = event.target.value;
        this.sObjectString = objectName;
        console.log(objectName);
    }

    get fields(){
        return this._objectFields.map((element) => {
            return {label: element, value: element};
        })
    }

    @api queryWithFields;

    _fields = [];
    _objectFields = [];
}