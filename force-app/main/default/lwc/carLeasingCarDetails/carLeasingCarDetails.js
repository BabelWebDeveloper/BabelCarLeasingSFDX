import {LightningElement, wire, track, api} from 'lwc';
import findCarById from '@salesforce/apex/CarLeasingCarDetailsController.searchCarsById';
import listOfGalleryUrl from '@salesforce/apex/CarLeasingCarDetailsController.getUrlsFromContentDistribution';
import getAllComments from '@salesforce/apex/CarLeasingCarDetailsController.getAllComments';
import saveNewComment from '@salesforce/apex/CarLeasingCarDetailsController.createComment';
import {publish, MessageContext} from 'lightning/messageService';
import sendProductChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';
import Total_cost_of_car from '@salesforce/label/c.Total_cost_of_car';
import Monthly_payment from '@salesforce/label/c.Monthly_payment';
import Add_to_card from '@salesforce/label/c.Add_to_card';
import Horsepower from '@salesforce/label/c.Horsepower';
import Gearbox from '@salesforce/label/c.Gearbox';
import Engine from '@salesforce/label/c.Engine';
import Body from '@salesforce/label/c.Body';
import isGuest from '@salesforce/user/isGuest';

export default class CarLeasingCarDetails extends LightningElement {
    carId;
    isGuestUser = isGuest;

    @track
    car;
    unitPrice;
    discountPrice;
    picture;
    horsepower;
    gearbox;
    engine;
    body;
    manufacturer;
    model;
    totalMonthlyPayment;
    review;
    isLoading;
    acceleration;
    theSizeOfTheWheels;
    engineCapacity;
    length;
    width;
    height;
    numberOfSeats;
    fuelConsumption;
    yearOfProduction;
    listOfGalleryPictures;
    cartItemsNumber = 0;
    changePriceCss;
    comments;
    pictureComment;
    showComments;
    showCommentApprove = false;
    showEmptyCommentField = false;

    maxStartFee;
    stepOfFee;
    contractPeriod = 24;
    intRate = 1.25;
    startFee = 0;
    monInt = this.intRate / 1200;
    carsQuantity = 1;
    newCommentText = '';
    

    connectedCallback() {
        this.isLoading = true;
        this.carId = this.getQueryCarId().recordId;
        listOfGalleryUrl({
            productId: this.carId
        })
        .then((result) => {
            if (result) {
                this.listOfGalleryPictures = result;
            } else {
                this.isLoading = false;
            }
        })
        .then(() => {
            this.retrieveAllComments();
        })
        
    }

    @wire(MessageContext)
    messageContext;

    @wire(findCarById, {carId: '$carId'})
    wiredCars(result) {
        this.isLoading = true;
        if (result.data){
            if (result.data !== undefined) {
                this.car = result.data[0];
                this.picture = this.car.Product2.Picture__c;
                this.horsepower = this.car.Product2.Horsepower__c;
                this.gearbox = this.car.Product2.Gearbox__c;
                this.engine = this.car.Product2.Engine_Type__c;
                this.body = this.car.Product2.Body_Type__c;
                this.manufacturer = this.car.Product2.Manufacturer__c;
                this.model = this.car.Product2.Model__c;
                this.review = this.car.Product2.ReviewLink__c;
                this.acceleration = this.car.Product2.Acceleration__c;
                this.maxStartFee = this.car.UnitPrice * 0.3;
                this.stepOfFee = this.car.UnitPrice * 0.3 * 0.1;
                this.theSizeOfTheWheels = this.car.Product2.The_size_of_the_wheels__c;
                this.engineCapacity = this.car.Product2.Engine_capacity__c;
                this.length = this.car.Product2.Length__c;
                this.width = this.car.Product2.Width__c;
                this.height = this.car.Product2.Height__c;
                this.numberOfSeats = this.car.Product2.Number_of_seats__c;
                this.fuelConsumption = this.car.Product2.Average_fuel_consumption__c;
                this.yearOfProduction = this.car.Product2.Year_of_production__c;

                if (result.data[1] !== undefined){
                    if (result.data[1].UnitPrice > result.data[0].UnitPrice) {
                        this.unitPrice = result.data[1].UnitPrice;
                        this.discountPrice = result.data[0].UnitPrice;
                    }
                    else {
                        this.unitPrice = result.data[0].UnitPrice;
                        this.discountPrice = result.data[1].UnitPrice;
                    }
                    this.changePriceCss = true;
                }
                else {
                    this.unitPrice = result.data[0].UnitPrice;
                }
                this.calculateLeasing();
            } else {
                this.isLoading = false;
            }
        }
    }

    get priceClass(){
        return this.changePriceCss ? 'text-decoration: line-through;color:red;font-size: 20px;' : 'font-size: 30px;';
    }

    get discountPriceClass(){
        return this.changePriceCss ? 'font-size: 30px;' : 'visibility: hidden';
    }

    addProductToCart(){
        this.isLoading = true;
        let finalPrice;
        if (this.discountPrice !== undefined){
            finalPrice = this.discountPrice;
        } else {
            finalPrice = this.unitPrice;
        }
        const detailsLoad = {
            carId: this.carId,
            carManufacturer: this.manufacturer,
            carModel: this.model,
            carPicture: this.picture,
            totalMonthlyPayment: this.totalMonthlyPayment,
            carsQuantity: this.carsQuantity,
            contractPeriod: this.contractPeriod,
            startFee: this.startFee,
            unitPrice: finalPrice,
            cartItemsNumber: this.cartItemsNumber
        };
        this.sendMessageService(detailsLoad);
        this.showToast('success','Item added to cart','utility:success',3000);
    }

    sendMessageService(detailsLoad) {
        publish(this.messageContext, sendProductChannel, detailsLoad);
        this.isLoading = false;
    }

    getQueryCarId() {
        let params = {};
        let search = location.search.substring(1);

        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === "" ? value : decodeURIComponent(value)
            });
        }

        return params;
    }

    get carPicture() {
        return `height:50vh;background-image:url(${this.picture})`;
    }

    setContractPeriod(event) {
        this.contractPeriod = event.detail.value;
        this.calculateLeasing();
    }

    setStartFee(event) {
        this.startFee = event.detail.value;
        this.calculateLeasing();
    }

    calculateLeasing() {
        this.totalMonthlyPayment = ((
                        (this.monInt +
                            (this.monInt / (Math.pow((1 + this.monInt), this.contractPeriod) - 1))
                        ) *
                        (this.unitPrice - (this.startFee || 0))
                    ) * this.carsQuantity).toFixed(2);
        this.isLoading = false;
    }

    increaseQuantity() {
        this.carsQuantity++;
        this.calculateLeasing();
    }

    decreaseQuantity() {
        if (this.carsQuantity > 1) {
            this.carsQuantity--;
            this.calculateLeasing();
        }
    }

    label = {
        Total_cost_of_car,
        Monthly_payment,
        Add_to_card,
        Horsepower,
        Gearbox,
        Engine,
        Body
    }

    @track type='';
    @track message = '';
    @track messageIsHtml = false;
    @track showToastBar = false;
    @api autoCloseTime = 3000;
    @track icon='utility:success';

    @api
    showToast(type, message,icon,time) {
        this.type = type;
        this.message = message;
        this.icon = icon;
        this.autoCloseTime = time;
        this.showToastBar = true;
        this.isLoading = false;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }

    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
    }

    @track
    style = 0;
    size = 3;
    carouselSize = (this.size - 1) * 100;

    next(){
        if(this.style < this.carouselSize){
            this.style += 100;
        } else {
            this.style = this.carouselSize;
        }
    }

    previous(){
        if(this.style >= 0){
            this.style -= 100;
        } else {
            this.style = 0;
        }
    }

    get myStyle(){
        return 'transform:translateX(-' + this.style + '%)';
    }

    handleNewComment(event) {
        console.log(event.target.value);
        this.newCommentText = event.target.value;
    }

    saveComment(){
        if (this.newCommentText === null || this.newCommentText.trim() === "") {
            this.showEmptyCommentField = true;
        } else {
            console.log(this.newCommentText);
            this.showEmptyCommentField = false;
            this.showCommentApprove = true;
        }
        
        // saveNewComment({
        //     product2Id: this.carId,
        //     commentText: this.newCommentText
        // })
        // .then(() => {
        //     this.retrieveAllComments();
        // })
    }

    retrieveAllComments(){
        getAllComments({
            product2Id: this.carId
        })
        .then(results => {
            if (results) {
                if (results.length > 0) {
                    this.showComments = true;
                    this.comments = results.map((result) => ({
                        text: result.CommentText__c,
                        createdByPicture: 'https://bwd2-dev-ed.file.force.com/' + result.CreatedBy.SmallPhotoUrl,
                        createdByName: result.CreatedBy.Name,
                        rating: result.Rating__c
                    }));
                } else{
                    this.showComments = false;
                }
                this.isLoading = false;
            } else {
                this.isLoading = false;
            }
        })
    }
}