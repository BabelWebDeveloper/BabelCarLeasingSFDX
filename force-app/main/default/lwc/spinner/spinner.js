import { LightningElement, api } from 'lwc';

export default class Spinner extends LightningElement {
    spinnerUri = "https://bwd2-dev-ed.file.force.com/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Gif&versionId=0687Q000004ZyJv&operationContext=CHATTER&contentId=05T7Q00000MH1z2";

    @api variant = 'transparent';

    get isVariantTransparent() {
        return this.variant === 'transparent';
    }

    get isVariantFullWhite() {
        return this.variant === 'full';
    }
}