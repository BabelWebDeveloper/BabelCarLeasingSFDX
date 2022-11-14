import { LightningElement, track } from 'lwc';
import allCases from '@salesforce/apex/CarLeasingReclamationsController.getAllCases';

export default class CarLeasingReclamations extends LightningElement {
    @track
    cases;
    showConnectedMessage = false;
    isLoading;

    connectedCallback() {
        this.isLoading = true;
        this.getAllCases();
    }

    getAllCases(){
        allCases({})
        .then(results => {
            if(results){
                this.reformatResults(results);
                if(results.length > 0){
                    this.showConnectedMessage = false;
                } else {
                    this.showConnectedMessage = true;
                }
            }
            else{
                this.isLoading = false;
            }
        })
    }

    reformatResults(result){
        let tempProps = JSON.parse(JSON.stringify(result));
        if(result){
            tempProps.forEach(record => {
                record.CreatedDate = record.CreatedDate.slice(0, -8).replace('T', ' ');
                Object.preventExtensions(tempProps);
            });
            Object.preventExtensions(tempProps);
            this.cases = tempProps;
        }
        this.isLoading = false;
    }
}