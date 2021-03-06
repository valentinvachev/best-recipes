import { getUser } from "../../utils/user.js"
import { getAllRecipes } from "../../utils/data.js"
import { determinePages, gatherInfoRecipe, filterSearch, searchFilterHeader, redirectSortingFunction, sortRecipesByCriteria } from "../../utils/itemUtil.js"

export async function getRequestSearchedNameRecipes(context) {

    let user = await getUser();

    if (user.loggedIn && user.validToken) {

        let allRecipesDB = await getAllRecipes();
        let query = context.params.query;
        let recipesDB = [];
        let recipes = [];

        gatherInfoRecipe(allRecipesDB, recipesDB);
        recipesDB = filterSearch(recipesDB, query);
        sortRecipesByCriteria(context.params, recipesDB, user);
        determinePages(context.params.page, 10, recipesDB, recipes, user);

        user.query = query;

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            recipe: await this.load("./templates/recipe-home.hbs"),
            addRecipe: await this.load("./templates/add-recipe.hbs"),
            dashboard: await this.load("./templates/all-recipes/dashboard.hbs"),
            sorting: await this.load("./templates/sorting/sorting.hbs"),
            pagination: await this.load("./templates/pagination/pagination.hbs")
        }

        this.partial("./templates/all-recipes/search-page.hbs", user, manageEvents);

    } else {
        this.redirect("#/logout");
    }


    function manageEvents() {
        searchFilterHeader(context);
        redirectSortingFunction(context);
    }
}