import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { editRecipe, getSpecificRecipe } from "../../utils/data.js"
import { transformProductsAndPreparation, waitingButton, searchFilterHeader, domainName } from "../../utils/itemUtil.js"

export async function getRequestEdit(context) {

    let user = await getUser();

    if (user.loggedIn) {

        let id = context.params.id;
        let recipe = await getSpecificRecipe(id);

        let templateObject = Object.assign({}, user, recipe);
        transformProductsAndPreparation(templateObject);
        templateObject.id = id;

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
        }

        this.partial("./templates/add-edit/edit.hbs", templateObject, manageEvents);

    } else {
        this.redirect("#/login");
    }

    function manageEvents() {
        searchFilterHeader(context);
    }
}



export async function postRequestEdit(context) {

    let { name, time, portions, category, products, preparation } = this.params;

    const image = document.getElementById('image').files[0];
    products = products.split("\n").filter(e => e !== "");
    preparation = preparation.split("\n").filter(e => e !== "");

    const redirect = this.redirect.bind(this);
    const id = document.getElementsByClassName("container")[0].dataset.id;

    if (!name) {
        notificationManager.invalidInfo("Добави име на рецептата");
    } else if (products.length === 0) {
        notificationManager.invalidInfo("Полето с продукти не може да бъде празно");
    } else if (preparation.length === 0) {
        notificationManager.invalidInfo("Полето с инструкции за приготвяне не може да бъде празно");
    } else {

        let recipeToPatch = { name, time, portions, products, preparation, category, id };

        try {
            waitingButton(document.getElementsByTagName("button")[0], "Моля изчакайте...", "Публикувай");
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
            waitingButton(document.getElementsByTagName("button")[0], "Моля изчакайте...", "Публикувай");
        }

    }
}