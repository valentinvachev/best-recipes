import * as databaseManager from "./firebase.js"
import {errorTranslator} from "../utils/itemUtil.js"


export async function getAllRecipes() {
    return await (await fetch(`${databaseManager.getBaseDatabaseUrl()}.json`)).json();
}


export async function getSpecificRecipe(id) {
    return await (await fetch(`${databaseManager.getBaseDatabaseUrl()}/${id}.json`)).json();
}

export async function updateRecipe(id, comments) {

    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.getBaseDatabaseUrl()}/${id}.json?auth=${idToken}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ comments })
    });

    let data = await response.json();

    return data;
}

export async function deleteRecipe(id) {

    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.getBaseDatabaseUrl()}/${id}.json?auth=${idToken}`, {
        method: "DELETE",
    });

    let data = await response.json();

    return data;
}


export async function updateRecipeRating(id, rating, peopleRated, timesRated) {

    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.getBaseDatabaseUrl()}/${id}.json?auth=${idToken}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating, peopleRated, timesRated })
    });

    let data = await response.json();

    return data;
}


export async function updateProfilePicture(photoUrl) {
    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.updateProfile()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken, photoUrl })
    });

    let data = await response.json();

    console.log(data);
    return data;

}


export async function getUserDataFunction() {

    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.getUserData()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
    });

    let data = await response.json();
    if (data.error) {
        console.log(data.error);
        window.history.pushState({}, '', `#/logout`);
    }
    return data.users[0];
}


export async function deleteUserFunction() {
    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.deleteUser()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
    });
}

export async function changePasswordFunction(password) {
    let idToken = await databaseManager.getToken();

    let response = await fetch(`${databaseManager.changePassword()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken, password, returnSecureToken: true })
    });


    let data = await response.json();
    console.log(data);
    return data;
}


export async function registerUser(email, password,username) {

    let response = await fetch(`${databaseManager.registerRESTApi()}${databaseManager.getApiKey()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, displayName: username, returnSecureToken: true })
        });

    if (!response.ok) {
        let data = await response.json();
        let message = data.error.message;
        throw new Error(errorTranslator(message));
    }

    let data = await response.json();
    return data;
}


export async function loginUser(email,password) {

    let response = await fetch(`${databaseManager.loginRESTApi()}${databaseManager.getApiKey()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    if (!response.ok) {
        let data = await response.json();
        let message = data.error.message;
        throw new Error(errorTranslator(message));
    }

    let data = await response.json();
    return data;
}


export async function resetPassword(email) {
    let response = await fetch(`${databaseManager.requestNewPassword()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestType: "PASSWORD_RESET",email })
    });

    if (!response.ok) {
        let data = await response.json();
        let message = data.error.message;
        throw new Error(errorTranslator(message));
    }

    let data = await response.json();
    return data;
}

export async function addRecipe(name, time, portions, products, preparation, category, creator, urlImage, rating, peopleRated, comments, dateAdded, timesRated, username, idUser) {

    let response = await fetch(`${databaseManager.getBaseDatabaseUrl()}.json?auth=${await databaseManager.getToken()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, time, portions, products, preparation, category, creator, urlImage, rating, peopleRated, comments, dateAdded, timesRated, username, idUser })
    });

    console.log(response);

    if (!response.ok) {
        let data = await response.json();
        let message = data.error.message;
        throw new Error(errorTranslator(message));
    }

    let data = await response.json();
    return data;
}


export async function editRecipe(recipeToPatch) {

    let response = await fetch(`${databaseManager.getBaseDatabaseUrl()}/${recipeToPatch.id}.json?auth=${await databaseManager.getToken()}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeToPatch)
    });

    if (!response.ok) {
        let data = await response.json();
        let message = data.error.message;
        throw new Error(errorTranslator(message));
    }

    let data = await response.json();
    return data;
}