import { LightningElement, track } from "lwc";
import login from "@salesforce/apex/CarLeasingAdminController.login";

export default class CarLeasingLogInForm extends LightningElement {
    arrowIconUri =
        "https://britenet55-dev-ed.my.salesforce.com/sfc/dist/version/download/?oid=00D7S000000rT0V&ids=0687S000007oUJrQAM&d=/a/7S000000CfOr/RldwY7eShKcrOXrxJMBKUAESQAj94ZkDZjeENeeJAIg&operationContext=DELIVERY&viewId=05H7S000000XkK3UAK&dpt=";


    error;
    isLoading;

    email = "";
    password = "";
    @track inputType = 'password';

    startUrl = 'https://bwd2-dev-ed.my.site.com/bcl/';

    get isPasswordVisible() {
        return this.inputType !== 'password';
    }

    get areLoginFormFieldsFilled() {
        return Boolean(this.email && this.password);
    }

    connectedCallback() {
        console.log(this.startUrl);
    }

    onEmailChange(event) {
        this.email = event.target.value;
        console.log(this.email);
        if (this.email.length > 127) {
        this.email = this.email.slice(0, 127);
        }
    }

    onPasswordChange(event) {
        this.password = event.target.value;
        console.log(this.password);
        if (this.password.length > 127) {
        this.password = this.password.slice(0, 127);
        }
    }

    handleLoginButtonClick() {
        if (this.areLoginFormFieldsFilled) {
        this.login();
        }
    }

    handleLogoClick() {
        window.open("/s/", "_top");
    }

    login() {
        console.log(this.email);
        console.log(this.password);
        console.log(this.startUrl);
        this.isLoading = true;
        let wrapper = {
            email: this.email,
            password: this.password,
            startUrl: this.startUrl
        }
        login({
            loginWrapper: wrapper
        })
        .then((result) => {
            if (result) {
            console.log("result: ", result);
            if (result.startsWith("https://")) {
                this.error = undefined;
                window.open(result, "_self");
            } else {
                this.setError(result);
            }
            }
        })
        .catch((error) => {
            this.error = error.message;
            alert(this.error);
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    setError(message) {
        if (
        message.startsWith(
            "Your login attempt has failed. Make sure the username and password are correct."
        )
        ) {
        this.error =
            "Your login attempt has failed. Make sure the username and password are correct.";
        } else {
        this.error = message;
        }
    }

    showPassword() {
        if (this.inputType === 'password') {
            this.inputType = 'text';
        } else {
            this.inputType = 'password';
        }
    }
}