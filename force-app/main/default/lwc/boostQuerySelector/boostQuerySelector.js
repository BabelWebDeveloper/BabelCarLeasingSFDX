import { LightningElement, track, api, wire } from 'lwc';
import getObjects from '@salesforce/apex/BoostFieldSelectorController.getObjects';
import setPermissions from '@salesforce/apex/BoostFieldSelectorController.setQueryPermissions';

export default class BoostQuerySelector extends LightningElement {
    @track sobjects;
    @track allValues = [];
    @track advancedMode = true;
    @track progressValue;
    @track enableObjectsSelecton;
    @track enableFieldsSelecton;
    @track enableConditionsSelecton;
    @track enableOrdering;
    @track enableLimit;

    inputQuery;
    queryString = 'SELECT ';
    queryFields;
    objectName;

    connectedCallback() {
        let wrapper = {
            enableObjectsSelecton: true,
            enableFieldsSelecton: true,
            enableConditionsSelecton: true,
            enableOrdering: true,
            enableLimit: true
        }
        setPermissions({wrapper : wrapper})
        .then(result => {
            this.enableObjectsSelecton = result.enableObjectsSelecton;
            this.enableFieldsSelecton = result.enableFieldsSelecton;
            this.enableConditionsSelecton = result.enableConditionsSelecton;
            this.enableOrdering = result.enableOrdering;
            this.enableLimit = result.enableLimit;
        })
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
            this.queryString += ' FROM ' + this.objectName;
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
        this.objectName = sObjectName;
    }

    hanldeQueryFieldsChange(event) {
        let fields = event.detail;
        let formattedFieldsSplit = fields.split(',');
        if (formattedFieldsSplit[0] !== '') {
            this.query = fields;
        } else {
            this.queryString = 'SELECT ';
        }
        console.log(this.query);
    }

    value;

    handleChange(event) {
        let objectName = event.target.value;
        this.objectName = objectName;
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