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
        // transformProductsAndPreparation(templateObject);
        templateObject.id = id;

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            preparation: await this.load("./templates/details-product/preparation-stage.hbs"),
            products: await this.load("./templates/details-product/product.hbs"),
        }

        this.partial("./templates/add-edit/edit.hbs", templateObject, manageEvents);

    } else {
        this.redirect("#/login");
    }

    function manageEvents() {
        searchFilterHeader(context);

        var quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }]
                ]
            },
            placeholder: '',
            theme: 'snow'
        });

        var quill = new Quill('#products-editor-container', {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    ['link'],
                    [{ list: 'ordered' }, { list: 'bullet' }]
                ]
            },
            placeholder: '',
            theme: 'snow'
        });


      
        let button = document.querySelector("button.btn.submit");
        button.addEventListener("click", () => {
            let paragraph = document.getElementsByClassName("ql-editor")[1];
            let preparation = document.querySelector("#preparation");
            preparation.value = paragraph.innerHTML;

            let paragraphProducts = document.getElementsByClassName("ql-editor")[0];
            let products = document.querySelector("#products");
            products.value = paragraphProducts.innerHTML;
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