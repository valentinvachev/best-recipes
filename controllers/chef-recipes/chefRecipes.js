import { getUser } from "../../utils/user.js"
import { getAllRecipes } from "../../utils/data.js"
import { determinePages, gatherInfoRecipe, findTotalPeopleVoted, searchFilterHeader, redirectSortingFunction, sortRecipesByCriteria, filterRecipesByOwnerIdUser, domainName } from "../../utils/itemUtil.js"

export async function getRequestChef(context) {

    let user = await getUser();

    if (user.loggedIn) {

        let allRecipesDB = await getAllRecipes();
        let recipesDB = [];
        let recipes = [];

        console.log(context.params);

        gatherInfoRecipe(allRecipesDB, recipesDB);
        recipesDB = filterRecipesByOwnerIdUser(recipesDB, context.params.idUser);
        findTotalPeopleVoted(recipesDB, user);
        sortRecipesByCriteria(context.params, recipesDB, user);
        determinePages(context.params.page, 10, recipesDB, recipes, user);

        user.chef = context.params.username;


        console.log(user);

        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            recipe: await this.load("./templates/recipe-home.hbs"),
            addRecipe: await this.load("./templates/add-recipe.hbs"),
            sorting: await this.load("./templates/sorting/sorting.hbs"),
            pagination: await this.load("./templates/pagination/pagination.hbs")
        }

        this.partial("./templates/chef-recipes/chef-recipes.hbs", user, manageEvents);

    } else {
        this.redirect("#/login");
    }

    function manageEvents() {
        searchFilterHeader();
        redirectSortingFunction(context);
    }
}