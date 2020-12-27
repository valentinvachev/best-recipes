import { getUser } from "../utils/user.js"
import { getAllRecipes } from "../utils/data.js"
import { gatherInfoRecipe, searchFilterHeader } from "../utils/itemUtil.js"

export async function getRequestHome() {

    let user = await getUser();

    let allRecipesDB = await getAllRecipes();
    let allRecipes = [];
    gatherInfoRecipe(allRecipesDB, allRecipes);

    const highestRatingRecipes = allRecipes.slice().sort((a, b) => b.rating - a.rating);
    const latestRecipes = allRecipes.sort((a, b) => {
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);

        return dateB - dateA;
    });


    user.highRatingRecipes = highestRatingRecipes.slice(0, 10);
    user.latestRecipes = latestRecipes.slice(0, 10);

    this.partials = {
        header: await this.load("./templates/header-footer/header.hbs"),
        footer: await this.load("./templates/header-footer/footer.hbs"),
        addRecipe: await this.load("./templates/add-recipe.hbs"),
        recipe: await this.load("./templates/recipe-home.hbs"),
    }

    this.partial("./templates/home.hbs", user, manageEvents);

    function manageEvents() {
        searchFilterHeader();
    }
}