import { LightningElement, api } from 'lwc';

export default class Spinner extends LightningElement {
    spinnerUri = "https://britenet55-dev-ed.file.force.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Gif&versionId=0687S000007oVjc&operationContext=DELIVERY&contentId=05T7S00000SddbA&page=0&d=/a/7S000000CfPk/nZpSQR4plm1_SyK_jTwEPeInUxXHt1tybmgkL15fn80&oid=00D7S000000rT0V&dpt=null&viewId=";

    @api variant = 'transparent';

    get isVariantTransparent() {
        return this.variant === 'transparent';
    }

    get isVariantFullWhite() {
        return this.variant === 'full';
    }
}