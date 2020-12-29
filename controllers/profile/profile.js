import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { updateProfilePicture, deleteUserFunction, changePasswordFunction } from "../../utils/data.js"
import { searchFilterHeader, domainName } from "../../utils/itemUtil.js"

export async function getRequestProfile(context) {

    let user = await getUser();

    if (user.loggedIn) {

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
        }

        this.partial("./templates/profile/profile.hbs", user, manageEvents);

    } else {
        this.redirect("#/login");
    }

    function manageEvents() {


        searchFilterHeader(context);

        const button = document.getElementById("change-picture");
        const buttonDelete = document.getElementById("delete-profile");
        const changePassword = document.getElementsByClassName("action-profile")[0];
        const saveChanges = document.getElementsByClassName("action-profile")[2];

        button.addEventListener("click", async(e) => {

            const file = document.getElementById('image-profile').files[0];

            if (file) {
                button.disabled = true;
                let fileName = file.name + Math.random();
                let storageRef = storage.ref('photos/' + fileName);
                let task = await storageRef.put(file);
                let photoUrl = await storageRef.getDownloadURL();

                try {

                    await updateProfilePicture(photoUrl);

                    const image = document.getElementsByTagName("img")[1];
                    image.src = photoUrl;
                    document.getElementById('image-profile').value = "";

                } catch (e) {

                }
            }

            button.disabled = false;
        });

        buttonDelete.addEventListener("click", async(e) => {
            await deleteUserFunction();
            // localStorage.removeItem("auth");
            context.redirect("/login");
        });

        changePassword.addEventListener("click", (e) => {
            Array.from(document.getElementsByClassName("password-profile"))
                .forEach(e => e.style.display = "inline-block");

            changePassword.disabled = true;
        });

        saveChanges.addEventListener("click", async(e) => {
            let password = document.getElementById("password");
            let repeatPassword = document.getElementById("repeatPassword");

            if (password.value.length < 6) {
                notificationManager.invalidInfo("Паролата трябва да е поне 6 символа");
            } else if (password.value !== repeatPassword.value) {
                notificationManager.invalidInfo("Паролите не съвпадат");
            } else {

                try {
                    saveChanges.disabled = true;
                    let data = await changePasswordFunction(password.value);
                    saveChanges.disabled = false;
                    changePassword.disabled = false;
                    Array.from(document.getElementsByClassName("password-profile"))
                        .forEach(e => e.style.display = "none");


                    let user = JSON.parse(localStorage.getItem("auth"));
                    localStorage.removeItem("auth");
                    user.idToken = data.idToken;
                    user.refreshToken = data.refreshToken;
                    localStorage.setItem("auth", JSON.stringify(user));
                } catch (e) {
                    console.log(e.message);
                }

            }

            password.value = "";
            repeatPassword.value = "";
        })
    }
}