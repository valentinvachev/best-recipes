import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { updateProfilePicture, deleteUserFunction, changePasswordFunction } from "../../utils/data.js"
import { searchFilterHeader, waitingButton, manageImageButton,paramsOfCanvas } from "../../utils/itemUtil.js"

export async function getRequestProfile(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
        }

        this.partial("./templates/profile/profile.hbs", user, manageEvents);

    } else {
        this.redirect("#/logout");
    }

    function manageEvents() {


        searchFilterHeader(context);



        const button = document.getElementById("change-picture");
        const buttonDelete = document.getElementById("delete-profile");
        const changePassword = document.getElementsByClassName("action-profile")[0];
        const saveChanges = document.getElementsByClassName("action-profile")[2];
        let imageInput = document.getElementById("image-profile");
        let buttonUpload = document.getElementById("btn-upload-profile");

        imageInput.addEventListener("change", () => {
            manageImageButton(imageInput, buttonUpload);
        })

        button.addEventListener("click", async (e) => {

            const file = document.getElementById('image-profile').files[0];

            if (file) {
                try {
                    waitingButton(button, "Зареждане...", "Смени");

                    let newFile = null;
                    let photoUrl = null;

                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener("load", async (e) => {

                        const imgElements = document.createElement("img");
                        imgElements.src = e.target.result;
                        imgElements.addEventListener("load", async (event) => {


                            newFile = await paramsOfCanvas(file.name, event);
                            let fileName = newFile.name + Math.random();
                            let storageRef = storage.ref('photos/' + fileName);
                            await storageRef.put(newFile);
                            photoUrl = await storageRef.getDownloadURL();

                            await updateProfilePicture(photoUrl);

                            const image = document.getElementsByTagName("img")[1];
                            image.src = photoUrl;
                            buttonUpload.textContent = "Прикачи снимка";

                            // console.log(buttonUpload.querySelector("#image-profile"));
                            if (!buttonUpload.querySelector("#image-profile")) {
                                buttonUpload.appendChild(imageInput);
                            }

                            waitingButton(button, "Зареждане...", "Смени");
                        })
                    })

                } catch (e) {
                    waitingButton(button, "Зареждане...", "Смени");
                    buttonUpload.textContent = "Прикачи снимка";

                    if (!buttonUpload.querySelector("#image-profile")) {
                        buttonUpload.appendChild(imageInput);
                    }

                    // console.log(e.message);
                }

            }
        });

        buttonDelete.addEventListener("click", async (e) => {
            waitingButton(buttonDelete, "Зареждане...", "Изтриий профила");
            await deleteUserFunction();
            waitingButton(buttonDelete, "Зареждане...", "Изтриий профила");
            context.redirect("#/logout");
        });

        changePassword.addEventListener("click", (e) => {
            Array.from(document.getElementsByClassName("password-profile"))
                .forEach(e => e.style.display = "inline-block");

            waitingButton(changePassword, "Смени паролата", "Смени паролата");
        });

        saveChanges.addEventListener("click", async (e) => {
            let password = document.getElementById("password");
            let repeatPassword = document.getElementById("repeatPassword");

            if (password.value.length < 6) {
                notificationManager.invalidInfo("Паролата трябва да е поне 6 символа");
            } else if (password.value !== repeatPassword.value) {
                notificationManager.invalidInfo("Паролите не съвпадат");
            } else {

                try {
                    waitingButton(saveChanges, "Зареждане...", "Запази промените");
                    let data = await changePasswordFunction(password.value);
                    waitingButton(saveChanges, "Зареждане...", "Запази промените");
                    waitingButton(changePassword, "Смени паролата", "Смени паролата");
                    Array.from(document.getElementsByClassName("password-profile"))
                        .forEach(e => e.style.display = "none");

                    let user = JSON.parse(localStorage.getItem("auth"));
                    localStorage.removeItem("auth");
                    user.idToken = data["idToken"];
                    user.refreshToken = data["refreshToken"];
                    localStorage.setItem("auth", JSON.stringify(user));
                } catch (e) {
                    
                    notificationManager.invalidInfo("Моля, влезте със старата парола и отново сменете с новата парола");
                    context.redirect("#/logout");
                }

            }

            password.value = "";
            repeatPassword.value = "";
        })
    }
}