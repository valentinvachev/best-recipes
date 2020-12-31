import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { waitingButton, searchFilterHeader } from "../../utils/itemUtil.js"
import { loginUser } from "../../utils/data.js";

export async function getRequestLogin(context) {

    let user = await getUser();

    this.partials = {
        header: await this.load("./templates/header-footer/header.hbs"),
        footer: await this.load("./templates/header-footer/footer.hbs"),
    }

    this.partial("./templates/login-register/login.hbs", user, manageEvents);

    function manageEvents() {
        searchFilterHeader(context);
    }
}

export async function postRequestLogin(context) {

    const { email, password } = this.params;

    if (!email) {
        notificationManager.invalidInfo("Въведете имейл");
    } else if (!password) {
        notificationManager.invalidInfo("Паролата трябва да е поне 6 символа");
    } else {

        try {

            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Влез");
            let data = await loginUser(email, password);
            let auth = { idToken: data.idToken, refreshToken: data.refreshToken };
            localStorage.setItem("auth", JSON.stringify(auth));

            this.redirect("#/home");

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Влез");
        }


    }

    document.getElementById("password").value = "";
}