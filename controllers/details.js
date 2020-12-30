import { getUser } from "../utils/user.js"
import { getSpecificRecipe, updateRecipe, updateRecipeRating } from "../utils/data.js"
import { manageComments, checkIfUserOwnRecipe as checkIUserRecipeRelationship, waitingButton, searchFilterHeader } from "../utils/itemUtil.js"
import { determinePagesComments, domainName } from "../utils/itemUtil.js"

export async function getRequestDetails(context) {

    let user = await getUser();
    let recipe = null;

    let redirect = this.redirect.bind(this);

    if (user.loggedIn) {

        recipe = await getSpecificRecipe(context.params.id);
        manageComments(recipe);
        recipe.id = context.params.id;

        let comments = [];
        determinePagesComments(context.params.number, 5, recipe.comments, comments, user);
        checkIUserRecipeRelationship(user.email, recipe);

        let templateObject = Object.assign({}, user, recipe);
        templateObject.comments = comments;
 
        this.partials = {
            header: await this.load("./templates/header-footer/header.hbs"),
            footer: await this.load("./templates/header-footer/footer.hbs"),
            products: await this.load("./templates/details-product/product.hbs"),
            addRecipe: await this.load("./templates/add-recipe.hbs"),
            preparation: await this.load("./templates/details-product/preparation-stage.hbs"),
            comment: await this.load("./templates/details-product/comment.hbs"),
        }

        this.partial("./templates/details-product/details.hbs", templateObject, manageEvents);

    } else {
        this.redirect("#/login");
    }



    function manageEvents() {

        searchFilterHeader(context);

        let area = document.getElementById("comment-area-text");
        let sectionComments = document.getElementsByClassName("comments")[0];
        let buttonPublish = document.getElementsByClassName("comment-button")[0];
        let ratingButton = document.getElementById("rating-button");

        if (ratingButton) {
            ratingButton.addEventListener("click", async(e) => {

                let vote = Number(document.getElementById("rating").value);
                let timesRated = recipe.peopleRated.length;
                let newVoter = { email: user.email, rating: vote };
                recipe.peopleRated.push(newVoter);

                let sumRatings = recipe.peopleRated.filter(u => u.rating !== 0).reduce((a, b) => {
                    return a + b.rating;
                }, 0)

                let newRating = sumRatings / timesRated;
                const id = context.params.id;

                waitingButton(ratingButton, "Моля изчакайте...", "Дайте своята оценка");
                await updateRecipeRating(id, newRating, recipe.peopleRated, timesRated);
                waitingButton(ratingButton, "Моля изчакайте...", "Дайте своята оценка");
                document.getElementById("voting").style.display = "none";
                document.getElementById("already-voted").style.display = "block";
            })
        }

        sectionComments.addEventListener("click", async(e) => {

            if (e.target.id === "edit-comment" || e.target.id === "publish-comment" ||
                e.target.id === "delete-comment" || e.target.id === "edit-comment-pic" || e.target.id === "delete-comment-pic") {

                let root = null;

                if (e.target.id === "edit-comment-pic" || e.target.id === "delete-comment-pic") {
                    root = e.target.parentElement.parentElement;
                } else {
                    root = e.target.parentElement;
                }

                let commentArea = root.children[6];
                let commentAreaEdit = root.children[7];
                let buttonEditComment = root.children[3];
                let buttonPublishComment = root.children[4];
                let buttonDeleteComment = root.children[5];
                let indexToUpdate = buttonDeleteComment.parentElement.dataset.id;

                if (e.target.id === "edit-comment" || e.target.id === "edit-comment-pic") {

                    commentArea.style.display = "none";
                    commentAreaEdit.style.display = "block";

                    buttonEditComment.style.display = "none";
                    buttonPublishComment.style.display = "block";

                } else if (e.target.id === "publish-comment") {

                    if (commentAreaEdit.value.trim() !== "") {
                        commentArea.textContent = commentAreaEdit.value;

                        let comments = recipe.comments;
                        comments[indexToUpdate].comment = commentAreaEdit.value;

                        const id = context.params.id;
                        const number = context.params.number;

                        waitingButton(e.target, "Моля изчакайте...", "Публикувай");

                        await updateRecipe(id, comments);

                        waitingButton(e.target, "Моля изчакайте...", "Публикувай");
                        setTimeout(() => redirect(`#/recipe/${id}/comments/page/${number}`), 0);

                    }

                    commentArea.style.display = "block";
                    commentAreaEdit.style.display = "none";

                    buttonEditComment.style.display = "block";
                    buttonPublishComment.style.display = "none";


                } else if (e.target.id === "delete-comment" || e.target.id === "delete-comment-pic") {

                    let comments = recipe.comments;
                    comments.splice(indexToUpdate, 1);

                    const id = context.params.id;
                    const number = context.params.number;

                    waitingButton(e.target, "", "");
                    await updateRecipe(id, comments);

                    setTimeout(() => redirect(`#/recipe/${id}/comments/page/1/published`), 1000);
                    setTimeout(() => redirect(`#/recipe/${id}/comments/page/1`), 1000);
                    waitingButton(e.target, "", "");
                }

            }
        })


        buttonPublish.addEventListener("click", async() => {
            if (area.value.trim() !== "") {

                let comments = recipe.comments;

                let date = constructDateFormat();

                comments.unshift({ email: user.email, author: user.username, comment: area.value, datePublished: date, photoUrl: user.photoUrl });

                const id = context.params.id;

                waitingButton(buttonPublish, "Моля изчакайте...", "Публикувай");
                area.value = "";

                await updateRecipe(id, comments);

                setTimeout(() => redirect(`#/recipe/${id}/comments/page/1/published`), 1000);
                setTimeout(() => redirect(`#/recipe/${id}/comments/page/1`), 1000);
                setTimeout(() => waitingButton(buttonPublish, "Моля изчакайте...", "Публикувай"), 1000);
            }
        })


        function constructDateFormat() {
            let dateArray = new Date().toISOString().split('T')[0].split("-");

            switch (dateArray[1]) {
                case "01":
                    dateArray[1] = "Януари";
                    break;
                case "02":
                    dateArray[1] = "Февруари";
                    break;
                case "03":
                    dateArray[1] = "Март";
                    break;
                case "04":
                    dateArray[1] = "Април";
                    break;
                case "05":
                    dateArray[1] = "Май";
                    break;
                case "06":
                    dateArray[1] = "Юни";
                    break;
                case "07":
                    dateArray[1] = "Юли";
                    break;
                case "08":
                    dateArray[1] = "Август";
                    break;
                case "09":
                    dateArray[1] = "Септември";
                    break;
                case "10":
                    dateArray[1] = "Октомври";
                    break;
                case "11":
                    dateArray[1] = "Ноември";
                    break;
                case "12":
                    dateArray[1] = "Декември";
                    break;
            }

            return dateArray.reverse().join(" ");
        }
    }


}