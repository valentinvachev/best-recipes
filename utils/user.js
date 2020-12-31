import * as databaseManager from "../utils/firebase.js"
import { getUserDataFunction,checkIdTokenValidity } from "./data.js"
import { domainName } from "./itemUtil.js"

export async function getUser() {

    let user = {};
    // console.log(JSON.parse(localStorage.getItem("auth")));

    if (localStorage.getItem("auth") && await checkIdTokenValidity()) {
            user = await getUserDataFunction();
            user.validToken = true;
            user.loggedIn = true;
            user.username = getUsername(user);
        
    } else {
        user = { loggedIn: false }
    }

    domainName(user);
    return user;
}

export async function getUserWithValidToken() {

    let user = {};
    // console.log(JSON.parse(localStorage.getItem("auth")));

    if (localStorage.getItem("auth") && await checkIdTokenValidity()) {

            user = await getUserDataFunction();
            user.validToken = true;
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