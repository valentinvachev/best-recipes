import { getUser } from "../../utils/user.js"
import * as notificationManager from "../notifications/notifications.js"
import { waitingButton, searchFilterHeader, domainName } from "../../utils/itemUtil.js"
import { addRecipe } from "../../utils/data.js"

export async function getRequestAdd(context) {

    let user = await getUser();

    if (user.loggedIn) {

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
        }

        this.partial("./templates/add-edit/add.hbs", user, manageEvents);

    } else {
        this.redirect("#/login");
    }


    function manageEvents() {
        searchFilterHeader(context);
    }
}


export async function postRequestAdd(context) {

    let user = await getUser();

    let { name, time, portions, category, products, preparation } = this.params;
    const image = document.getElementById('image').files[0];

    const creator = user.email;
    const username = user.displayName
    const idUser = user.localId;
    const rating = 0;
    const peopleRated = [{ email: "null", rating: 0 }];
    const timesRated = 0;
    const dateAdded = new Date().toISOString();

    products = products.split("\n").filter(e => e !== "");
    preparation = preparation.split("\n").filter(e => e !== "");
    const comments = [{ author: "", comment: "", datePublished: "" }];

    if (!name) {
        notificationManager.invalidInfo("Добави име на рецептата");
    } else if (products.length === 0) {
        notificationManager.invalidInfo("Полето с продукти не може да бъде празно");
    } else if (preparation.length === 0) {
        notificationManager.invalidInfo("Полето с инструкции за приготвяне не може да бъде празно");
    } else if (!image) {
        notificationManager.invalidInfo("Добави снимка към рецептата");
    } else {


        try {
            waitingButton(document.getElementsByTagName("button")[0], "Моля изчакайте...", "Публикувай");

            let file = document.getElementById("image").files[0];
            let fileName = file.name + Math.random();
            let storageRef = storage.ref('photos/' + fileName);
            await storageRef.put(file);
            const urlImage = await storageRef.getDownloadURL();


            await addRecipe(name, time, portions, products, preparation, category, creator, urlImage, rating, peopleRated, comments, dateAdded, timesRated, username, idUser);
            this.redirect("#/home");

        } catch (e) {
            notificationManager.invalidInfo(`${e.message}`);
            waitingButton(document.getElementsByTagName("button")[0], "Моля изчакайте...", "Публикувай");
        }

    }
}