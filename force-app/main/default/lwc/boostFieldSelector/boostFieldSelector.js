import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';
import getAllSObjectFields from '@salesforce/apex/BoostFieldSelectorController.getAllSObjectFields';

export default class BoostQuerySelector extends LightningElement {
    @api name;
    @track allValues = [];

    value;


    get fields(){
        return this._objectFields.map((element) => {
            return {label: element, value: element};
        })
    }

    @wire(getAllSObjectFields, { sObjectString: '$name'})
    wiredSobjectFields(results){
        this.allValues = [];
        this.value = '';
        this.isLoading = true;
        if (results.data) {
            this._objectFields = results.data;
        }
        this.isLoading = false;
    }

    handleChange(event) {
        if(!this.allValues.includes(event.target.value)){
            this.allValues.push(event.target.value);
        }
        console.log(this.allValues);
    }

    handleRemove(event){
        const valueRemoved = event.target.value;
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
    }

    
    _fields = [];
    _objectFields = [];
}