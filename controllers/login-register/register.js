import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { registerUser } from "../../utils/data.js"
import { waitingButton, searchFilterHeader } from "../../utils/itemUtil.js"

export async function getRequestRegister(context) {

    let user = await getUser();

    this.partials = {
        header: await this.load("./templates/header-footer/header.hbs"),
        footer: await this.load("./templates/header-footer/footer.hbs"),
    }

    this.partial("./templates/login-register/register.hbs", user, manageEvents);

    function manageEvents() {
        searchFilterHeader(context);
    }
}


export async function postRequestRegister(context) {

    const { email, password, repeatPassword, username } = this.params;

    if (!email) {
        notificationManager.invalidInfo("Въведете емейл");
    } else if (!username) {
        notificationManager.invalidInfo("Въведете потребителско име");
    } else if (password.length < 6) {
        notificationManager.invalidInfo("Паролата трябва да е поне 6 символа");
    } else if (password !== repeatPassword) {
        notificationManager.invalidInfo("Паролите не съвпадат");
    } else {

        try {

            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Регистрирай");
            let data = await registerUser(email, password, username);
            let auth = { idToken: data.idToken, refreshToken: data.refreshToken };
            localStorage.setItem("auth", JSON.stringify(auth));
            this.redirect("#/home");

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Регистрирай");
        }

    }

    document.getElementById("password").value = "";
    document.getElementById("repeatPassword").value = "";
}