import {LightningElement, wire} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import PRODUCT2_OBJECT from '@salesforce/schema/Product2';
import ENGINE_TYPE from '@salesforce/schema/Product2.Engine_Type__c';

export default class GetPicklistValuesOfField extends LightningElement {

    value = '';

    @wire(getObjectInfo, {objectApiName: PRODUCT2_OBJECT})
    accountMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId',
            fieldApiName: ENGINE_TYPE
        }
    )
    industryPicklist;

    handleChange(event) {
        this.value = event.detail.value;
    }
}