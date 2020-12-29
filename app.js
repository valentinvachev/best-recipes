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
        this.get("/#/home", getRequestHome);
        this.get("/", getRequestHome);
        this.get("/#/", getRequestHome);
        this.get("/#/login", getRequestLogin);
        this.get("/#/reset-password", getRequestReset);
        this.get("/#/register", getRequestRegister);
        this.get("/#/logout", getRequestLogout);
        this.get("/#/add", getRequestAdd);

        this.get("/#/recipes/search/:query/page/:page", getRequestSearchedNameRecipes);
        this.get("/#/recipes/search/:query/sorted/:sorting/page/:page", getRequestSearchedNameRecipes);

        this.get("/#/recipes/page/:page", getRequestAllRecipes);
        this.get("/#/recipes/sorted/:sorting/page/:page", getRequestAllRecipes);

        this.get("/#/recipes/:category/page/:page", getRequestCategory);
        this.get("/#/recipes/:category/sorted/:sorting/page/:page", getRequestCategory);

        this.get("/#/my-recipes/page/:page", getRequestMyRecipes);
        this.get("/#/my-recipes/sorted/:sorting/page/:page", getRequestMyRecipes);

        this.get("/#/my-recipes/:category/page/:page", getRequestMyCategory);
        this.get("/#/my-recipes/:category/sorted/:sorting/page/:page", getRequestMyCategory);

        this.get("/#/recipe/:id/comments/page/:number", getRequestDetails);
        this.get("/#/recipe/:id/comments/page/:number/published", getRequestDetails);

        this.get("/#/recipes/chef/:username/:idUser/page/:page", getRequestChef);
        this.get("/#/recipes/chef/:username/:idUser/sorted/:sorting/page/:page", getRequestChef);


        this.get("/#/delete/:id", postRequestDelete);
        this.get("/#/edit/:id", getRequestEdit);
        this.get("/#/my-profile", getRequestProfile);

        this.post("/#/register", (context) => { postRequestRegister.call(context); });
        this.post("/#/login", (context) => { postRequestLogin.call(context); });
        this.post("/#/reset-password", (context) => { postRequestReset.call(context); });
        this.post("/#/add", (context) => { postRequestAdd.call(context); });
        this.post("/#/edit", (context) => { postRequestEdit.call(context); });
    });

    app.run();

}
controller();