import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { editRecipe, getSpecificRecipe } from "../../utils/data.js"
import {waitingButton, searchFilterHeader, addTextEditor,manageImageButton } from "../../utils/itemUtil.js"

export async function getRequestEdit(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        let id = context.params.id;
        let recipe = await getSpecificRecipe(id);

        let templateObject = Object.assign({}, user, recipe);
        templateObject.id = id;

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            preparation: await this.load("./templates/details-product/preparation-stage.hbs"),
            products: await this.load("./templates/details-product/product.hbs"),
        }

        this.partial("./templates/add-edit/edit.hbs", templateObject, manageEvents);

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



export async function postRequestEdit(context) {

    let { name, time, portions, category, products, preparation } = this.params;

    const image = document.getElementById('image').files[0];
    const productsTextToCheck = document.getElementsByClassName("ql-editor")[0].textContent;
    const preparationTextToCheck = document.getElementsByClassName("ql-editor")[1].textContent;

    const redirect = this.redirect.bind(this);
    const id = document.getElementsByClassName("container")[0].dataset.id;

    if (!name) {
        notificationManager.invalidInfo("Добави име на рецептата");
    } else if (!productsTextToCheck) {
        notificationManager.invalidInfo("Полето с продукти не може да бъде празно");
    } else if (!preparationTextToCheck) {
        notificationManager.invalidInfo("Полето с инструкции за приготвяне не може да бъде празно");
    } else {

        let recipeToPatch = { name, time, portions, products, preparation, category, id };

        try {
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Публикувай");
            if (image !== undefined) {
                let file = document.getElementById("image").files[0];
                let fileName = file.name + Math.random();
                let storageRef = storage.ref('photos/' + fileName);
                await storageRef.put(file);
                let urlImage = await storageRef.getDownloadURL();
                recipeToPatch.urlImage = urlImage;
            }

            let data = await editRecipe(recipeToPatch);
            redirect(`#/recipe/${id}/comments/page/:number`);

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.querySelector("button.btn.submit"), "Зареждане...", "Публикувай");
        }

    }
}