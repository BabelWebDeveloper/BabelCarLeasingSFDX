import {LightningElement, track, wire, api} from 'lwc';
import userOrderItems from '@salesforce/apex/CarLeasingCartController.getOrderItems';
import createOrder from '@salesforce/apex/CarLeasingCartController.setActiveOrder';
import Cart_items from '@salesforce/label/c.Cart_items';
import Quantity from '@salesforce/label/c.Quantity';
import Your_cart_is_empty from '@salesforce/label/c.Your_cart_is_empty';
import Piece from '@salesforce/label/c.Piece';
import Summary from '@salesforce/label/c.Summary';
import Total_cost from '@salesforce/label/c.Total_cost';
import changeOrderItemQuantity from '@salesforce/apex/CarLeasingCartController.changeOrderItemQuantity';
import carDeleteBackend from '@salesforce/apex/CarLeasingCartController.deleteOrderItem';

import userId from '@salesforce/user/Id';
import userOrder from '@salesforce/apex/CarLeasingCartController.getUserOrder';

export default class CarLeasingCartItems extends LightningElement {
    @track
    orderId;
    orderItems;
    totalCost = 0;
    checkoutItems = [];
    message = '';
    showConnectedMessage = false;
    userId;
    isLoading;

    billingStreet = '';
    billingCity = '';
    billingStateProvince = '';
    billingCountry = '';
    billingZipPostalCode = '';

    label = {
        Cart_items,
        Quantity,
        Your_cart_is_empty,
        Piece,
        Summary,
        Total_cost
    }

    connectedCallback() {
        this.isLoading = true;
        this.userId = userId;
        userOrder()
        .then(result => {
            if(result){
                this.orderId = result.Id;
            } else {
                this.isLoading = false; 
            }
        })
        .catch((error) => {
            this.error = error;
        })
    }

    @wire(userOrderItems, {orderId: '$orderId'})
    wiredOrderItems(results) {
        if (results.data){
            if (results.data.length !== 0){
                this.showConnectedMessage = true;
            } else {
                this.showConnectedMessage = false;
            }
            this.orderItems = results.data.map((result) => ({
                Id : result.Id,
                OrderId : result.OrderId,
                Product2 : result.Product2,
                Product2Id : result.Product2Id,
                Quantity : result.Quantity,
                UnitPrice : result.UnitPrice,
                totalPrice: result.Quantity * result.UnitPrice
            }));
            this.calculateTotalCost();
        }
    }

    calculateTotalCost() {
        let cartItem;
        for (let i = 0; i < this.orderItems.length; i++) {
            let totalCostOfOneItem = this.orderItems[i].Quantity * this.orderItems[i].UnitPrice;
            this.totalCost += totalCostOfOneItem;
            cartItem = {
                cartItemQuantity: this.orderItems[i].Quantity,
                cartItemUnitPrice: this.orderItems[i].UnitPrice,
                cartItemManufacturer: this.orderItems[i].Product2.Manufacturer__c,
                cartItemModel: this.orderItems[i].Product2.Model__c,
                cartItemCostItem: totalCostOfOneItem,
                cartItemId: this.orderItems[i].Product2.Id
            }
            this.checkoutItems.push(cartItem);
        }
        this.totalCost = this.totalCost.toFixed(2);
        this.isLoading = false;
    }

    handleBilling() {
        this.billingStreet = event.target.value;
    }
    handleCity() {
        this.billingCity = event.target.value;
    }
    handleStateProvince() {
        this.billingStateProvince = event.target.value;
    }
    handleCountry() {
        this.billingCountry = event.target.value;
    }
    handleZipPostalCode() {
        this.billingZipPostalCode = event.target.value;
    }

    checkout() {
        this.isLoading = true;
        if (
            this.billingStreet === "" ||
            this.billingCity === "" ||
            this.billingStateProvince === "" ||
            this.billingCountry === "" ||
            this.billingZipPostalCode === ""
        ) {
            this.message = 'Please fill all empty fields.'
        }
        else {
            this.message = '';
            this.createActiveOrder();
        }
    }

    createActiveOrder(){
        createOrder({
            billingStreet: this.billingStreet,
            billingCity: this.billingCity,
            billingStateProvince: this.billingStateProvince,
            billingCountry: this.billingCountry,
            billingZipPostalCode: this.billingZipPostalCode,
            orderId: this.orderId
        })
        .then(() => {
            this.showToast('success','Order was created','utility:success',3000);
        })
        .then(() => {
            window.location.href = "/bcl/orders";
        })
        .catch((error) => {
            this.error = error;
        })
        .finally(() => {
            this.isLoading = false; 
        });
    }
    
    showDeleteMessage() {
        this.showToast('success','Item deleted from cart','utility:success',3000);
    }

    @track type = '';
    @track message = '';
    @track messageIsHtml = false;
    @track showToastBar = false;
    @api autoCloseTime = 3000;
    @track icon = 'utility:success';

    @api
    showToast(type, message,icon,time) {
        this.type = type;
        this.message = message;
        this.icon=icon;
        this.autoCloseTime=time;
        this.showToastBar = true;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }

    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
        window.location.reload();
    }

    increaseQuantity(event) {
        this.isLoading = true;
        let orderItemId = event.target.dataset.id;
        let quantity = event.target.dataset.quantity;
        quantity++;
        changeOrderItemQuantity({
            orderId: orderItemId,
            quantity: quantity
        })
        .then(() => {
            window.location.reload();
        })
        .catch((error) => {
            this.error = error;
        })
    }

    decreaseQuantity(event) {
        let orderItemId = event.target.dataset.id;
        let quantity = event.target.dataset.quantity;
        if (quantity > 1) {
            this.isLoading = true;
            let newQuantity = quantity - 1;
            changeOrderItemQuantity({
                orderId: orderItemId,
                quantity: newQuantity
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                this.error = error;
            })
        }
    }
}