import { deleteRecipe } from "../../utils/data.js"
import { getUser } from "../../utils/user.js"
import { waitingButton } from "../../utils/itemUtil.js"

export async function postRequestDelete(context) {

    let user = await getUser();

    if (user.loggedIn) {

        let id = context.params.id;
        waitingButton(document.getElementById("delete-recipe", "Моля изчакайте...", ""))
        await deleteRecipe(id);
        context.redirect("/best-recipes/#/home");

    } else {
        this.redirect("/best-recipes/#/login");
    }
}