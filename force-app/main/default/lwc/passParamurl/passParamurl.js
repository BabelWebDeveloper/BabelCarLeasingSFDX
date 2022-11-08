import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class MyComponentName extends LightningElement {

    parameters = {};

    connectedCallback() {

        this.parameters = this.getQueryParameters();
        console.log(this.parameters.test);
    }
    // recordId

    getQueryParameters() {

        var params = {};
        var search = location.search.substring(1);

        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === "" ? value : decodeURIComponent(value)
            });
        }

        return params;
    }
}