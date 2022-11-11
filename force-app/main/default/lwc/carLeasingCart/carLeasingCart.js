// import {LightningElement, wire, track} from 'lwc';
// import Id from '@salesforce/user/Id';
// import activePricebookId from '@salesforce/apex/CarLeasingCartController.getStandardPricebook';
// import userOrder from '@salesforce/apex/CarLeasingCartController.getUserOrder';
// // import userOrderItems from '@salesforce/apex/CarLeasingCartController.getOrderItems';
// import getUserAccountId from '@salesforce/apex/CarLeasingCartController.getUserAccountId';
// import getUserAccountId2 from '@salesforce/apex/CarLeasingCartController.getUserAccountId2';
// import createOrderAndOrderItem from '@salesforce/apex/CarLeasingCartController.createOrderItem';
// import {subscribe, MessageContext} from 'lightning/messageService';
// import retrieveProductFromChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';
// import cartUrl from '@salesforce/resourceUrl/clcart';

// export default class CarLeasingCart extends LightningElement {
//     subscription = null;

//     @track
//     userId;
//     orderId;
//     activePricebook;
//     userAccountId;
//     carId;
//     orderItems;
//     // orderItemsNumber;
//     // cartItemsNumber;
//     // showItemsNumberInCart = false;

//     manufacturer;
//     model;
//     picture;
//     totalMonthlyPayment;
//     carsQuantity;
//     contractPeriod;
//     startFee;
//     unitPrice;

//     @wire(MessageContext)
//     messageContext;

//     connectedCallback() {
//         this.userId = Id;
//         activePricebookId()
//             .then((result) => {
//                 this.activePricebook = result;
//             })
//             // .then(() => {
//             //     userOrder()
//             //     .then(result => {
//             //         if (result) {
//             //             console.log('orderId:');
//             //             console.log(result);
//             //             this.orderId = result.data.Id;
//             //         }
//             //     })
//             //     .then(() => {
//             //         getUserAccountId2()
//             //         .then(result => {
//             //             if (result) {
//             //                 console.log('userAccountId2:');
//             //                 console.log(result);
//             //                 this.userAccountId = result.data;
//             //             }
//             //         })
//             //         .catch((error) => {
//             //             this.error = error;
//             //         });
//             //     })
//             //     .catch((error) => {
//             //         this.error = error;
//             //     });
//             // })
//             .catch((error) => {
//                 this.error = error;
//             });

//         // userOrder()
//         //     .then(result => {
//         //         if (result) {
//         //             this.orderId = result.data.Id;
//         //         }
//         //     })
//         //     .catch((error) => {
//         //         this.error = error;
//         //     });

//         // getUserAccountId2()
//         //     .then(result => {
//         //         if (result) {
//         //             this.userAccountId = result.data;
//         //         }
//         //     })
//         //     .catch((error) => {
//         //         this.error = error;
//         //     });

//         this.subscribeFromMessageChannel();
//     }

//     subscribeFromMessageChannel() {
//         if (!this.subscription) {
//             this.subscription = subscribe(
//                 this.messageContext,
//                 retrieveProductFromChannel,
//                 (message) => this.handleMessage(message)
//             );
//         }
//     }

//     handleMessage(message) {
//         this.carId = message.carId;
//         this.manufacturer = message.carManufacturer;
//         this.model = message.carModel;
//         this.picture = message.carPicture;
//         this.totalMonthlyPayment = message.totalMonthlyPayment;
//         this.carsQuantity = message.carsQuantity;
//         this.contractPeriod = message.contractPeriod;
//         this.startFee = message.startFee;
//         this.unitPrice = message.unitPrice;
//         this.cartItemsNumber = message.cartItemsNumber;
//         this.createOrderItem();
//     }

//     // createOrderItem() {
//     //     createOrderAndOrderItem({
//     //         carId: this.carId,
//     //         manufacturer: this.manufacturer,
//     //         model: this.model,
//     //         picture: this.picture,
//     //         totalMonthlyPayment: this.totalMonthlyPayment,
//     //         carsQuantity: this.carsQuantity,
//     //         contractPeriod: this.contractPeriod,
//     //         startFee: this.startFee,
//     //         unitPrice: this.unitPrice,
//     //     })
//     //         .then((result) => {})
//     //         .catch((error) => {
//     //             this.error = error;
//     //         });
//     // }

//     @wire(userOrder, {userId: '$userId'})
//     wiredOrder(result) {
//         if (result.data){
//             if (result.data !== undefined) {
//                 this.orderId = result.data.Id;
//             }
//         }
//     }

//     @wire(getUserAccountId, {userId: '$userId'})
//     wiredPricebook(result) {
//         if (result.data){
//             if (result.data !== undefined) {
//                 this.userAccountId = result.data;
//             }
//         }
//     }

//     createOrderItem() {
//         createOrderAndOrderItem({
//             userId: this.userId,
//             carId: this.carId,
//             manufacturer: this.manufacturer,
//             model: this.model,
//             picture: this.picture,
//             totalMonthlyPayment: this.totalMonthlyPayment,
//             carsQuantity: this.carsQuantity,
//             contractPeriod: this.contractPeriod,
//             startFee: this.startFee,
//             orderId: this.orderId,
//             userAccountId: this.userAccountId,
//             unitPrice: this.unitPrice,
//         })
//             .then((result) => {})
//             .catch((error) => {
//                 this.error = error;
//             });
//     }

//     // @wire(userOrderItems, {orderId: '$order'})
//     // wiredOrderItems(result) {
//     //     if (result.data){
//     //         if (result.data !== undefined) {
//     //             this.orderIdItemsNumber = result.data.length;
//     //             if (this.orderIdItemsNumber > 0) {
//     //                 this.showItemsNumberInCart = true;
//     //             }
//     //         }
//     //     }
//     // }

//     label = {
//         cartUrl
//     }

//     // showOrderItems(){
//     //     window.location.href = '/bcl/order-items?recordId=' + this.orderId;
//     // }

//     showOrderItems(){
//         window.location.href = '/bcl/order-items';
//     }
// }
import {LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingCartController.getStandardPricebook';
import userOrder from '@salesforce/apex/CarLeasingCartController.getUserOrder';
import userOrderItems from '@salesforce/apex/CarLeasingCartController.getOrderItems';
import userAccountId from '@salesforce/apex/CarLeasingCartController.getUserAccountId';
import createOrderAndOrderItem from '@salesforce/apex/CarLeasingCartController.createOrderItem';
import {subscribe, MessageContext} from 'lightning/messageService';
import sendProductChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';
import cartUrl from '@salesforce/resourceUrl/clcart';

export default class CarLeasingCart extends LightningElement {
    subscription = null;

    @track
    userId;
    order;
    activePricebook;
    userAccount;
    carId;
    orderItems;
    orderItemsNumber;
    cartItemsNumber;
    showItemsNumberInCart = false;

    manufacturer;
    model;
    picture;
    totalMonthlyPayment;
    carsQuantity;
    contractPeriod;
    startFee;
    unitPrice;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.userId = Id;
        activePricebookId()
            .then((result) => {
                this.activePricebook = result;
            })
            .catch((error) => {
                this.error = error;
            });

        this.subscribeFromMessageChannel();
    }

    subscribeFromMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                sendProductChannel,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.carId = message.carId;
        this.manufacturer = message.carManufacturer;
        this.model = message.carModel;
        this.picture = message.carPicture;
        this.totalMonthlyPayment = message.totalMonthlyPayment;
        this.carsQuantity = message.carsQuantity;
        this.contractPeriod = message.contractPeriod;
        this.startFee = message.startFee;
        this.unitPrice = message.unitPrice;
        this.cartItemsNumber = message.cartItemsNumber;
        console.log(this.cartItemsNumber);
        console.log(this.orderItemsNumber);
        this.createOrderItem();
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data){
            if (result.data !== undefined) {
                this.order = result.data.Id;
            }
        }
    }

    @wire(userAccountId, {userId: '$userId'})
    wiredPricebook(result) {
        if (result.data){
            if (result.data !== undefined) {
                this.userAccount = result.data;
            }
        }
    }

    createOrderItem() {
        createOrderAndOrderItem({
            userId: this.userId,
            carId: this.carId,
            manufacturer: this.manufacturer,
            model: this.model,
            picture: this.picture,
            totalMonthlyPayment: this.totalMonthlyPayment,
            carsQuantity: this.carsQuantity,
            contractPeriod: this.contractPeriod,
            startFee: this.startFee,
            orderId: this.order,
            userAccountId: this.userAccount,
            unitPrice: this.unitPrice,
        })
            .then((result) => {})
            .catch((error) => {
                this.error = error;
            });
    }

    @wire(userOrderItems, {orderId: '$order'})
    wiredOrderItems(result) {
        if (result.data){
            if (result.data !== undefined) {
                this.orderItemsNumber = result.data.length;
                if (this.orderItemsNumber > 0) {
                    this.showItemsNumberInCart = true;
                }
            }
        }
    }

    label = {
        cartUrl
    }

    showOrderItems(){
        window.location.href = '/bcl/order-items?recordId=' + this.order;
    }
}