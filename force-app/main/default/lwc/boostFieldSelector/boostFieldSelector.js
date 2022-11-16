import { LightningElement, track, api, wire } from 'lwc';
import getObjectFields from '@salesforce/apex/BoostFieldSelectorController.getObjectFields';

export default class BoostQuerySelector extends LightningElement {
    @api name;
    @api queryWithFields;
    @track allValues = [];
    @track enableFieldsSelecton;

    value;

    get fields(){
        return this._objectFields.map((element) => {
            return {label: element, value: element};
        })
    }

    get queryObjectField() {
        return this.queryWithFields;
    }

    set queryObjectField(value) {
        this.queryWithFields = '';
        this.queryWithFields += value;
        const selectedEvent = new CustomEvent("queryfieldschange", {
            detail: this.queryWithFields
        });
        this.dispatchEvent(selectedEvent);
    }

    @wire(getObjectFields, { objectName: '$name'})
    wiredSobjectFields(results){
        if (results) {
            this.allValues = [];
            this.value = '';
            this._fields = [];
            this._objectFields = [];
            this.isLoading = true;
            if (results.data) {
                this.enableFieldsSelecton = true;
                this._objectFields = results.data;
            }
        }
        this.isLoading = false;
    }

    handleChange(event) {
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(JSON.parse(JSON.stringify(event.target.value)));
        }
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