import { LightningElement} from 'lwc';

export default class ParentCmp extends LightningElement {
    myname = '';

    changeValue(){
        this.myname = 'SalesforceKid'
    }
}