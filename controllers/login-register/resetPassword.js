// import { getUser } from "../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { waitingButton, searchFilterHeader } from "../../utils/itemUtil.js"
import { resetPassword } from "../../utils/data.js";


export async function getRequestReset(context) {

    this.partials = {
        header: await this.load("./templates/header-footer/header.hbs"),
        footer: await this.load("./templates/header-footer/footer.hbs"),
    }

    this.partial("./templates/login-register/reset-password.hbs", null, manageEvents);

    function manageEvents() {
        searchFilterHeader(context);
    }
}


export async function postRequestReset(context) {

    const { email } = this.params;

    if (!email) {
        notificationManager.invalidInfo("Въведете имейл");
    } else {

        try {

            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Заяви нова парола");
            let data = await resetPassword(email);
            this.redirect("#/login");

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Заяви нова парола");
        }


    }
}