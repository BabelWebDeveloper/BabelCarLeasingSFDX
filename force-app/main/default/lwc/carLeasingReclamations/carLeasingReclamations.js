import { LightningElement, track } from 'lwc';
import allCases from '@salesforce/apex/CarLeasingReclamationsController.getAllCases';

export default class CarLeasingReclamations extends LightningElement {
    @track
    cases;

    connectedCallback() {
        this.getAllCases();
    }

    getAllCases(){
        allCases({})
        .then(results => {
            this.reformatResults(results);
        })
    }

    reformatResults(result){
        console.log(result);
        let tempProps = JSON.parse(JSON.stringify(result));
        if(result){
            if (result){
                tempProps.forEach(record => {
                    record.CreatedDate = record.CreatedDate.slice(0, -8).replace('T', ' ');
                    Object.preventExtensions(tempProps);
                });
                Object.preventExtensions(tempProps);
                this.cases = tempProps;
                console.log(this.cases);
            }
        }
    }
}