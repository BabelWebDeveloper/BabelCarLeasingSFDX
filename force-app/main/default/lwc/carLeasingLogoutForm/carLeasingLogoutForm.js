import { LightningElement } from 'lwc';

export default class CarLeasingLogoutForm extends LightningElement {
    referToLoginPage(){
        window.location.href = '/bcl/login';
    }
}