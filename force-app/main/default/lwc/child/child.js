import { LightningElement, api } from 'lwc';

export default class ParentCmp extends LightningElement {
   @api progressValue;
   handleChnage(event) {
      this.progressValue = event.target.value;
      
      const selectedEvent = new CustomEvent("progressvaluechange", {
         detail: this.progressValue
      });

      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
   }
}