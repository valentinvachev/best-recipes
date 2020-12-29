export function displayList(items, targetArray, rowsPerPage, page) {
    page--;

    let loop_start = rowsPerPage * page;
    let loop_end = loop_start + rowsPerPage;
    const paginatedItems = items.slice(loop_start, loop_end);

    for (let i = 0; i < paginatedItems.length; i++) {
        let recipe = paginatedItems[i];
        targetArray.push(recipe);
    }
}


export function determinePages(currentPage, itemsPerPage, arrayTakingFrom, arrayPagination, objectToAddPages) {
    currentPage = Number(currentPage);
    let lastPage = Math.ceil(arrayTakingFrom.length / itemsPerPage);

    displayList(arrayTakingFrom, arrayPagination, itemsPerPage, currentPage);

    objectToAddPages.recipes = arrayPagination;

    let nextPage = currentPage + 1;
    objectToAddPages.previousPage = currentPage - 1;

    if (nextPage <= lastPage) {
        objectToAddPages.nextPage = nextPage;
    }

    determineUrlBeforePage(objectToAddPages);
}

function determineUrlBeforePage(objectToAddPages) {
    let url = window.location.hash;
    objectToAddPages.urlBeforePage = url.substring(0, url.lastIndexOf("/"));
}


export function determinePagesComments(currentPage, itemsPerPage, arrayTakingFrom, arrayPagination, objectToAddPages) {
    currentPage = Number(currentPage);
    let lastPage = Math.ceil(arrayTakingFrom.length / itemsPerPage);

    displayList(arrayTakingFrom, arrayPagination, itemsPerPage, currentPage);

    objectToAddPages.comments = arrayPagination;

    let nextPage = currentPage + 1;
    objectToAddPages.previousPage = currentPage - 1;

    if (nextPage <= lastPage) {
        objectToAddPages.nextPage = nextPage;
    }
}


export function sortRecipesByCriteria(params, arrayRecipes, user) {
    let criteria = "";
    if (params.hasOwnProperty("sorting")) {
        criteria = params.sorting;
        user.sorting = criteria;

        switch (criteria) {
            case "latest":
                user.sortingTranslated = "Последно добавени";
                return arrayRecipes.sort((a, b) => {
                    const dateA = new Date(a.dateAdded);
                    const dateB = new Date(b.dateAdded);

                    return dateB - dateA;
                });
                break;
            case "rating":
                user.sortingTranslated = "Оценка";
                return arrayRecipes.sort((a, b) => b.rating - a.rating);
                break;
            case "popularity":
                user.sortingTranslated = "Полулярност";
                return arrayRecipes.sort((a, b) => b.timesRated - a.timesRated);
                break;
        }
    }

}

export function gatherInfoRecipe(initialArray, targetArray) {

    if (initialArray) {

        Object.keys(initialArray).forEach(k => {
            let recipe = initialArray[k];

            addId(recipe, k);
            addRating(recipe);
            manageComments(recipe);
            findTimesRated(recipe);

            targetArray.push(recipe);
        })
    }
}

function findTimesRated(recipe) {
    let timesRated = recipe.timesRated;

    if (timesRated === 1) {
        recipe.oneTimeRated = true;
    }
}

function addRating(recipe) {
    if (recipe.rating > 8) {
        recipe.star = true;
    }

    let rating = recipe.rating.toFixed(1);
    recipe.rating = rating;
}

function addId(recipe, id) {
    recipe.id = id;
}


export function transformProductsAndPreparation(objectToTransform) {
    objectToTransform.products = objectToTransform.products.join("\n");
    objectToTransform.preparation = objectToTransform.preparation.join("\n");
}

export function findTimeAndPortions(recipe) {
    if (recipe.portions && Number(recipe.portions) <= 0) {
        recipe.portions = 0;
    } else if (recipe.portions && Number(recipe.portions) === 1) {
        recipe.portionsOne = true;
        recipe.portions = 0;
    }

    if (recipe.time && Number(recipe.time) <= 0) {
        recipe.time = 0;
    } else if (recipe.time && Number(recipe.time) === 1) {
        recipe.timeOne = true;
        recipe.time = 0;
    }
}

export function findTotalPeopleVoted(array, user) {

    let totalPeopleCooked = 0;

    array.forEach(recipe => {
        totalPeopleCooked += recipe.timesRated;
    })


    totalPeopleCooked === 1 ? user.onePersonCooked = totalPeopleCooked : user.totalPeopleCooked = totalPeopleCooked;

}


export function manageComments(recipe) {
    let comments = recipe.comments;

    if (recipe.comments) {
        recipe.comments = comments.filter(c => c.comment.trim() !== "");
    } else {
        recipe.comments = [];
    }
}

export function addCommentsArray() {
    return [{ author: "", comment: "", datePublished: "" }];
}


export function checkIfUserOwnRecipe(email, recipe) {

    findTimeAndPortions(recipe);

    if (recipe.creator === email) {
        recipe.isCreator = true;
    } else {
        recipe.isCreator = false;
    }

    let index = 0;
    recipe.comments.forEach(c => {

        c.index = index++;

        if (c.email === email) {
            c.isCreatorComment = true;
        } else {
            c.isCreatorComment = false;
        }
    })


    let result = recipe.peopleRated.filter(u => u.email === email);

    if (result.length > 0) {
        recipe.isVoter = true;
    } else {
        recipe.isVoter = false;
    }
}


export function waitingButton(element, textWaiting, textDefault) {
    if (element.disabled) {
        element.disabled = false;
        element.textContent = textDefault;
    } else {
        element.disabled = true;
        element.textContent = textWaiting;
    }
}


export function filterRecipesByCategory(array, category) {

    let predicate = translateCategory(category);

    return array.filter(r => r.category.toLocaleLowerCase() === predicate.toLocaleLowerCase());
}


export function filterRecipesByCategoryAndOwner(array, category, owner) {

    let predicate = translateCategory(category);

    return array.filter(r => r.category.toLocaleLowerCase() === predicate.toLocaleLowerCase() && r.creator === owner);
}

export function filterRecipesByOwner(array, owner) {

    return array.filter(r => r.creator === owner);
}

export function filterRecipesByOwnerIdUser(array, idUser) {

    return array.filter(r => r.idUser === idUser);
}


export function translateCategory(initial) {

    let translated = "";

    switch (initial) {
        case "main-dish":
            translated = "Основно";
            break;
        case "breakfast":
            translated = "Закускa";
            break;
        case "salads":
            translated = "Салати";
            break;
        case "sauces":
            translated = "Сосове";
            break;
        case "starters":
            translated = "Предястие";
            break;
        case "desserts":
            translated = "Десерт";
            break;
        case "soups":
            translated = "Супи";
            break;
    }

    return translated;
}


export function errorTranslator(error) {
    let errorUpperCase = error.toLocaleUpperCase();

    if (errorUpperCase.startsWith("EMAIL_NOT_FOUND")) {
        return "Невалиден потребител";
    } else if (errorUpperCase.startsWith("INVALID_PASSWORD")) {
        return "Невалиднa парола";
    } else if (errorUpperCase.startsWith("USER_DISABLED")) {
        return "Достъпът на този потребител е ограничен от администратор";
    } else if (errorUpperCase.startsWith("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        return "Твърде много невалидни опити. Опитайте пак по-късно";
    } else if (errorUpperCase.startsWith("EMAIL_EXISTS")) {
        return "Този имейл вече е регистриран";
    } else {
        return error;
    }
}


export function filterSearch(array, predicate) {

    return array.filter(r => r.name.toLocaleLowerCase().includes(predicate.toLocaleLowerCase()));

}


export function searchFilterHeader(context) {

    const button = document.getElementById("recipes-search");
    const menuButtonMobile = document.getElementById("menu-mobile");

    if (button) {
        const searchingBox = document.querySelector("#search-form > form > input[type=text]:nth-child(1)");

        button.addEventListener("click", (e) => {
            e.preventDefault();

            const query = searchingBox.value.toLocaleLowerCase();

            if (query.trim() === "") {
                // window.history.pushState({}, '', `#/recipes/page/1`);
                context.redirect(`#/recipes/page/1`);
            } else {
                // window.history.pushState({}, '', `#/recipes/search/${query}/page/1`);
                context.redirect(`#/recipes/search/${query}/page/1`);
            }


        })


    }


    const nav = document.getElementsByTagName("nav")[0];

    menuButtonMobile.addEventListener("click", () => {

        if (nav.style.display === "none") {
            nav.style.display = "block";
        } else {
            nav.style.display = "none";
        }
    })

}


export function redirectSortingFunction(context) {
    let option = document.getElementsByTagName("select")[0];
    option.addEventListener("change", () => {
        let sorting = option.value;

        let url = window.location.href;
        let urlBase = "";

        let start = url.lastIndexOf("#");

        if (url.includes("sorted")) {
            urlBase = url.substring(start, url.lastIndexOf("/sorted"));
        } else {
            urlBase = url.substring(start, url.lastIndexOf("/page"));
        }


        // console.log(`/${urlBase}/sorted/${sorting}/page/1`);
        // context.redirect(`/${urlBase}/sorted/${sorting}/page/1`);
        // console.log(`${urlBase}/sorted/${sorting}/page/1`);
        // console.log(`/${urlBase}/sorted/${sorting}/page/1`)
        context.redirect(`${urlBase}/sorted/${sorting}/page/1`);
    })
}


export function domainName(user) {
    const domainName = "best-recipes";
    const domainNameRecipe = "best-recipes";
    // const domainName = "";
    // const domainNameRecipe = "";

    if (domainName) {
        user.domainName = "/" + domainName;
        user.domainNameRecipe = domainNameRecipe;
    }
}