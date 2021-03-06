import * as databaseManager from "../utils/firebase.js"
import { getUserDataFunction,checkIdTokenValidity } from "./data.js"
import { domainName } from "./itemUtil.js"

export async function getUser() {

    let user = {};

    if (localStorage.getItem("auth")) {
        // && await checkIdTokenValidity()
            try {
            user = await getUserDataFunction();
            user.validToken = true;
            user.loggedIn = true;
            user.username = getUsername(user);
            } catch (e) {
                user.validToken = false;
                console.log(e.message);
            }
        
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