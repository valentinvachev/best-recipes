import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { waitingButton, searchFilterHeader, addTextEditor,manageImageButton } from "../../utils/itemUtil.js"
import { addRecipe } from "../../utils/data.js"

export async function getRequestAdd(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
        }

        this.partial("./templates/add-edit/add.hbs", user, manageEvents);

    } else {
        this.redirect("#/logout");
    }


    function manageEvents() {
        searchFilterHeader(context);

        addTextEditor('#editor-container')
        addTextEditor('#products-editor-container');

        let button = document.querySelector("button.btn.submit");
        button.addEventListener("click", () => {
            let paragraph = document.getElementsByClassName("ql-editor")[1];
            let preparation = document.querySelector("#preparation");
            preparation.value = paragraph.innerHTML;

            let paragraphProducts = document.getElementsByClassName("ql-editor")[0];
            let products = document.querySelector("#products");
            products.value = paragraphProducts.innerHTML;
        })


        let imageInput = document.getElementById("image");
        let buttonUpload = document.getElementById("btn-upload");

        imageInput.addEventListener("change", () => {
            manageImageButton(imageInput,buttonUpload);
        })
    }
}


export async function postRequestAdd(context) {

    console.log(this.params);

    let user = await getUser();

    let { name, time, portions, category, products, preparation } = this.params;
    const image = document.getElementById('image').files[0];

    const productsTextToCheck = document.getElementsByClassName("ql-editor")[0].textContent;
    const preparationTextToCheck = document.getElementsByClassName("ql-editor")[1].textContent;
    const creator = user.email;
    const username = user.displayName
    const idUser = user.localId;
    const rating = 0;
    const peopleRated = [{ email: "null", rating: 0 }];
    const timesRated = 0;
    const dateAdded = new Date().toISOString();
    const comments = [{ author: "", comment: "", datePublished: "" }];

    if (!name) {
        notificationManager.invalidInfo("Добави име на рецептата");
    } else if (!productsTextToCheck) {
        notificationManager.invalidInfo("Полето с продукти не може да бъде празно");
    } else if (!preparationTextToCheck) {
        notificationManager.invalidInfo("Полето с инструкции за приготвяне не може да бъде празно");
    } else if (!image) {
        notificationManager.invalidInfo("Добави снимка към рецептата");
    } else {


        try {
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Публикувай");

            let file = document.getElementById("image").files[0];
            let fileName = file.name + Math.random();
            let storageRef = storage.ref('photos/' + fileName);
            await storageRef.put(file);
            const urlImage = await storageRef.getDownloadURL();


            await addRecipe(name, time, portions, products, preparation, category, creator, urlImage, rating, peopleRated, comments, dateAdded, timesRated, username, idUser);
            this.redirect("#/home");

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Публикувай");
        }

    }
}