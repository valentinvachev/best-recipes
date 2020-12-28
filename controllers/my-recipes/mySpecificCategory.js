import { getUser } from "../../utils/user.js"
import { getAllRecipes } from "../../utils/data.js"
import {
    determinePages,
    filterRecipesByCategoryAndOwner,
    translateCategory,
    gatherInfoRecipe,
    findTotalPeopleVoted,
    searchFilterHeader,
    sortRecipesByCriteria,
    redirectSortingFunction,
    domainName
} from "../../utils/itemUtil.js"

export async function getRequestMyCategory(context) {

    let user = await getUser();

    if (user.loggedIn) {

        let allRecipesDB = await getAllRecipes();
        let recipesDB = [];
        let recipes = [];
        let category = context.params.category;

        gatherInfoRecipe(allRecipesDB, recipesDB);
        findTotalPeopleVoted(recipesDB, user);
        recipesDB = filterRecipesByCategoryAndOwner(recipesDB, category, user.email);
        user.category = category
        user.categoryTranslated = translateCategory(category);
        sortRecipesByCriteria(context.params, recipesDB, user);
        determinePages(context.params.page, 10, recipesDB, recipes, user);


        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            recipe: await this.load("./templates/recipe-home.hbs"),
            addRecipe: await this.load("./templates/add-recipe.hbs"),
            myDashboard: await this.load("./templates/my-recipes/my-dashboard.hbs"),
            sorting: await this.load("./templates/sorting/sorting.hbs"),
            pagination: await this.load("./templates/pagination/pagination.hbs")
        }

        this.partial("./templates/my-recipes/my-specific-category.hbs", user, manageEvents);

    } else {
        this.redirect("#/login");
    }


    function manageEvents() {
        searchFilterHeader();
        redirectSortingFunction(context);

    }
}