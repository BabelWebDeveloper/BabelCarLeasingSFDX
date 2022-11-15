import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';
import getAllSObjectFields from '@salesforce/apex/BoostFieldSelectorController.getAllSObjectFields';

export default class BoostQuerySelector extends LightningElement {
    @api name;
    @api query;
    @track queryWithFields;
    @track allValues = [];
    @track enableFieldsSelector;

    value;

    get fields(){
        return this._objectFields.map((element) => {
            return {label: element, value: element};
        })
    }

    get queryObjectField() {
        return this.query;
    }

    set queryObjectField(value) {
        this.queryWithFields = this.query;
        this.queryWithFields += value;
    }

    @wire(getAllSObjectFields, { sObjectString: '$name'})
    wiredSobjectFields(results){
        if (results) {
            this.allValues = [];
            this.value = '';
            this._fields = [];
            this._objectFields = [];
            this.isLoading = true;
            if (results.data) {
                this.enableFieldsSelector = true;
                this._objectFields = results.data;
            }
        }
        this.isLoading = false;
    }

    handleChange(event) {
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(JSON.parse(JSON.stringify(event.target.value)));
        }
        console.log('allValues: ' + this.allValues);
        this.queryObjectField = this.allValues;
    }

    handleRemove(event){
        const valueRemoved = event.target.value;
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
        this.queryObjectField = this.allValues;
    }

    
    _fields = [];
    _objectFields = [];
}