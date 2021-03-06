import { deleteRecipe } from "../../utils/data.js"
import { getUser } from "../../utils/user.js"
import { waitingAnchor } from "../../utils/itemUtil.js"

export async function postRequestDelete(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        let id = context.params.id;
        waitingAnchor(document.getElementById("delete-recipe"), "Зареждане...", "Изтрий рецептата");
        await deleteRecipe(id);
        context.redirect("#/home");
        waitingAnchor(document.getElementById("delete-recipe"), "Зареждане...", "Изтрий рецептата");

    } else {
        this.redirect("#/logout");
    }
}