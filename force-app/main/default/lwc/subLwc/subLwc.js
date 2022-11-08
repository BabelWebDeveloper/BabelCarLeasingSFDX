import { LightningElement, wire } from 'lwc';
import { subscribe,MessageContext} from 'lightning/messageService';
import COUNTING_UPDATED_CHANNEL from '@salesforce/messageChannel/messageChannelName__c';



export default class SubLwc extends LightningElement {

    counter = 0;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
        this.subscription = subscribe(
            this.messageContext,
            COUNTING_UPDATED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message){
        //alert("message:"+JSON.stringify(message));

        if(message.operator == 'add'){

            this.counter += message.constant;
        }
        else if(message.operator == 'subtract'){

            this.counter -= message.constant;
        }
        else if(message.operator == 'multiply'){

            this.counter *= message.constant;
        }
    }
}