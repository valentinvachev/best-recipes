import * as databaseManager from "../utils/firebase.js"
import { getUserDataFunction } from "./data.js"
import { domainName } from "./itemUtil.js"

export async function getUser() {

    let user = null;

    if (localStorage.getItem("auth")) {
        user = await getUserDataFunction();
        user.loggedIn = true;

        user.username = getUsername(user);
    } else {
        user = { loggedIn: false }
    }

    domainName(user);
    return user;
}

export async function getIdToken() {
    let user = JSON.parse(localStorage.getItem("auth"));
    return await databaseManager.getToken(user);
}

function getUsername(user) {
    return user.displayName;
}