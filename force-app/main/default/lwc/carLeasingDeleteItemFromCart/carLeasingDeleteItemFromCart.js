import {api, track, LightningElement, wire} from 'lwc';
import carDeleteBackend from '@salesforce/apex/CarLeasingCartController.deleteOrderItem';

export default class CarLeasingDeleteItemFromCart extends LightningElement {
    @api
    car;
    @api
    selectedCarId;
    @api
    orderId;
    @api
    itemId;

    carDelete() {
        this.selectedCarId = this.car.Product2Id;
        this.orderId = this.car.OrderId;
        this.itemId = this.car.Id;
        carDeleteBackend({
            orderItemId: this.car.Id
        })
            .then(() => {
                this.dispatchEvent(new CustomEvent('showmessage'));
            })
            .catch((error) => {
                this.error = error;
            });
    }
}