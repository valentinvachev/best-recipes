import { getRequestHome } from "./controllers/home.js"
import { getRequestRegister, postRequestRegister } from "./controllers/login-register/register.js"
import { getRequestLogin, postRequestLogin } from "./controllers/login-register/login.js"
import { getRequestReset, postRequestReset } from "./controllers/login-register/resetPassword.js"
import { getRequestLogout } from "./controllers/login-register/logout.js"
import { getRequestAllRecipes } from "./controllers/all-recipes/allRecipes.js"
import { getRequestMyRecipes } from "./controllers/my-recipes/myRecipes.js"
import { getRequestAdd, postRequestAdd } from "./controllers/add-edit/add.js"
import { getRequestDetails } from "./controllers/details.js"
import { postRequestDelete } from "./controllers/add-edit/delete.js"
import { getRequestEdit, postRequestEdit } from "./controllers/add-edit/edit.js"
import { getRequestCategory } from "./controllers/all-recipes/specificCategory.js"
import { getRequestMyCategory } from "./controllers/my-recipes/mySpecificCategory.js"
import { getRequestSearchedNameRecipes } from "./controllers/all-recipes/searchPage.js"
import { getRequestProfile } from "./controllers/profile/profile.js"
import { getRequestChef } from "./controllers/chef-recipes/chefRecipes.js"


function controller() {
    const app = Sammy("#root", function(context) {

        this.use("Handlebars", "hbs");

        this.get("/best-recipes/#/home", getRequestHome);
        this.get("/best-recipes/", getRequestHome);
        this.get("/best-recipes/#/", getRequestHome);
        this.get("/best-recipes/#/login", getRequestLogin);
        this.get("/best-recipes/#/reset-password", getRequestReset);
        this.get("/best-recipes/#/register", getRequestRegister);
        this.get("/best-recipes/#/logout", getRequestLogout);
        this.get("/best-recipes/#/add", getRequestAdd);

        this.get("/best-recipes/#/recipes/search/:query/page/:page", getRequestSearchedNameRecipes);
        this.get("/best-recipes/#/recipes/search/:query/sorted/:sorting/page/:page", getRequestSearchedNameRecipes);

        this.get("/best-recipes/#/recipes/page/:page", getRequestAllRecipes);
        this.get("/best-recipes/#/recipes/sorted/:sorting/page/:page", getRequestAllRecipes);

        this.get("/best-recipes/#/recipes/:category/page/:page", getRequestCategory);
        this.get("/best-recipes/#/recipes/:category/sorted/:sorting/page/:page", getRequestCategory);

        this.get("/best-recipes/#/my-recipes/page/:page", getRequestMyRecipes);
        this.get("/best-recipes/#/my-recipes/sorted/:sorting/page/:page", getRequestMyRecipes);

        this.get("/best-recipes/#/my-recipes/:category/page/:page", getRequestMyCategory);
        this.get("/best-recipes/#/my-recipes/:category/sorted/:sorting/page/:page", getRequestMyCategory);

        this.get("/best-recipes/#/recipe/:id/comments/page/:number", getRequestDetails);
        this.get("/best-recipes/#/recipe/:id/comments/page/:number/published", getRequestDetails);

        this.get("/best-recipes/#/recipes/chef/:username/:idUser/page/:page", getRequestChef);
        this.get("/best-recipes/#/recipes/chef/:username/:idUser/sorted/:sorting/page/:page", getRequestChef);


        this.get("/best-recipes/#/delete/:id", postRequestDelete);
        this.get("/best-recipes/#/edit/:id", getRequestEdit);
        this.get("/best-recipes/#/my-profile", getRequestProfile);

        this.post("/best-recipes/#/register", (context) => { postRequestRegister.call(context); });
        this.post("/best-recipes/#/login", (context) => { postRequestLogin.call(context); });
        this.post("/best-recipes/#/reset-password", (context) => { postRequestReset.call(context); });
        this.post("/best-recipes/#/add", (context) => { postRequestAdd.call(context); });
        this.post("/best-recipes/#/edit", (context) => { postRequestEdit.call(context); });
    });

    app.run();

}
controller();