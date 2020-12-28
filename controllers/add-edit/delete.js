import { deleteRecipe } from "../../utils/data.js"
import { getUser } from "../../utils/user.js"
import { waitingButton, domainName } from "../../utils/itemUtil.js"

export async function postRequestDelete(context) {

    let user = await getUser();

    if (user.loggedIn) {

        let id = context.params.id;
        waitingButton(document.getElementById("delete-recipe", "Моля изчакайте...", ""))
        await deleteRecipe(id);
        context.redirect("#/home");

    } else {
        this.redirect("#/login");
    }
}