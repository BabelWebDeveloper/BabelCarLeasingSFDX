import {LightningElement, track, wire, api} from 'lwc';
import Id from '@salesforce/user/Id';
import getActiveOrders from '@salesforce/apex/CarLeasingOrdersController.getActiveOrders';
import createNewCase from '@salesforce/apex/CarLeasingOrdersController.createNewCase';
import getCaseTypeOptions from '@salesforce/apex/CarLeasingOrdersController.getCaseTypeOptions';
import getReasonTypeOptions from '@salesforce/apex/CarLeasingOrdersController.getReasonTypeOptions';
import Created  from '@salesforce/label/c.Created';
import EUR  from '@salesforce/label/c.EUR';
import Quantity  from '@salesforce/label/c.Quantity';
import You_haven_t_had_any_orders_yet from '@salesforce/label/c.You_haven_t_had_any_orders_yet';

export default class CarLeasingOrders extends LightningElement {
    @track
    activeOrders;
    userId;
    showConnectedMessage;
    caseTypeOptions;
    caseReasonOptions;
    isNewCaseModalOpen = false;
    
    caseType;
    reasonType;
    subject;
    description;
    orderItemId;

    label = {
        Created,
        EUR,
        Quantity,
        You_haven_t_had_any_orders_yet
    }

    connectedCallback() {
        console.log('connected callback');
        this.userId = Id;
        this.getCaseType();
        this.getReasonType();
    }

    @wire(getActiveOrders,{userId: '$userId'})
    wiredOrders(result){
        if(result){
            if (result.data !== undefined){
                if (result.data.length !== 0){
                    this.showConnectedMessage = false;
                } else {
                    this.showConnectedMessage = true;
                }
                this.reformatResults(result);
            }
        }
    }

    reformatResults(result){
        let tempProps = JSON.parse(JSON.stringify(result));
        if(result){
            if (result.data){
                tempProps.data.forEach(order => {
                    order.CreatedDate = order.CreatedDate.slice(0, -8).replace('T', ' ');
                    Object.preventExtensions(tempProps);
                });
                Object.preventExtensions(tempProps);
                this.activeOrders = tempProps;
            }
        }
    }

    reportProblem() {
        this.isNewCaseModalOpen = true;
        let wrapper = {
            orderItemId : this.orderItemId,
            caseType : this.caseType,
            caseReason : this.caseReason,
            description : this.description
        }
        console.log(wrapper);
        createNewCase({caseWrapper: wrapper})
        .then(result => {
            console.log(result);
        })
        .then(() => {
            this.showToast('success','Thank you. Problem was reported. We will contact you soon.','utility:success',3000);
        })
    }

    onServiceCaseTypeChange(event) {
        let value = event.target.value;
        this.caseType = value;
        console.log('this.caseType');
        console.log(this.caseType);
    }

    onServiceCaseReasonChange(event) {
        let value = event.target.value;
        this.reasonType = value;
        console.log('this.reasonType');
        console.log(this.reasonType);
    }

    getCaseType() {
        this.isLoading = true;
        getCaseTypeOptions({})
        .then((result) => {
            this.caseTypeOptions = result;
            this.error = undefined;
        }).catch((error) => {
            this.error = error.message;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    getReasonType() {
        this.isLoading = true;
        getReasonTypeOptions({})
        .then((result) => {
            this.caseReasonOptions = result;
            this.error = undefined;
        }).catch((error) => {
            this.error = error.message;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    openCaseModal(event){
        let targetId = event.target.dataset.targetId;
        this.orderItemId = targetId;
        console.log(this.orderItemId);
        this.isNewCaseModalOpen = true;
    }

    closeModal(){
        this.isNewCaseModalOpen = false;
    }

    handleInputChange(event) {
        this.description = event.detail.value;
    }

    @track type='';
    @track message = '';
    @track messageIsHtml = false;
    @track showToastBar = false;
    @api autoCloseTime = 3000;
    @track icon='utility:success';

    @api
    showToast(type, message, icon, time) {
        this.isNewCaseModalOpen = false;
        console.log('toast');
        this.type = type;
        this.message = message;
        this.icon = icon;
        this.autoCloseTime = time;
        this.showToastBar = true;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }

    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
    }
}