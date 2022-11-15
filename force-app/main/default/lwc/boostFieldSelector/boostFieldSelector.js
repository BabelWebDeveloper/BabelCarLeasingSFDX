import { LightningElement, track, api, wire } from 'lwc';
import getAllCustomSObjects from '@salesforce/apex/BoostFieldSelectorController.getAllCustomSObjects';
import getAllSObjectFields from '@salesforce/apex/BoostFieldSelectorController.getAllSObjectFields';

export default class BoostFieldSelector extends LightningElement {
    @track sobjects;
    @track allValues = [];
    // @api sObjectString;

    queryString;
    sObjectString;
    value;

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
    }

    get fields(){
        return this._objectFields.map((element) => {
            return {label: element, value: element};
        })
    }

    @wire(getAllSObjectFields, { sObjectString: '$sObjectString'})
    wiredSobjectFields(results){
        this.isLoading = true;
        if (results.data) {
            this._objectFields = results.data;
        }
        this.isLoading = false;
    }

    // ____________________________________________________________

    handleChange(event) {
        if(!this.allValues.includes(event.target.value)){
        this.allValues.push(event.target.value);
        }
    }

    handleRemove(event){
        const valueRemoved = event.target.value;
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
    }

    
    _fields = [];
    _objectFields = [];
}