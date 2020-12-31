import { getUser } from "../../utils/user.js"
import { getAllRecipes } from "../../utils/data.js"
import { gatherInfoRecipe, determinePages, searchFilterHeader, sortRecipesByCriteria, redirectSortingFunction } from "../../utils/itemUtil.js"

export async function getRequestAllRecipes(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        let allRecipesDB = await getAllRecipes();
        let recipesDB = [];
        let recipes = [];


        gatherInfoRecipe(allRecipesDB, recipesDB);
        sortRecipesByCriteria(context.params, recipesDB, user);
        determinePages(context.params.page, 10, recipesDB, recipes, user);

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            recipe: await this.load("./templates/recipe-home.hbs"),
            addRecipe: await this.load("./templates/add-recipe.hbs"),
            dashboard: await this.load("./templates/all-recipes/dashboard.hbs"),
            sorting: await this.load("./templates/sorting/sorting.hbs"),
            pagination: await this.load("./templates/pagination/pagination.hbs")
        }

        console.log(user);

        this.partial("./templates/all-recipes/all-recipes.hbs", user, manageEvents);

    } else {
        this.redirect("#/logout");
    }



    function manageEvents() {
        searchFilterHeader(context);
        redirectSortingFunction(context);
    }
}