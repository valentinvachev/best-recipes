export function getApiKey() {
    return "AIzaSyD9nt5UG8oqjMAH3zAqIDl7hJCCgxc1fRw";
}

export function getBaseDatabaseUrl() {
    return "https://recipeproject-f0551-default-rtdb.firebaseio.com/recipes";
}

export function registerRESTApi() {
    return "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
}


export function loginRESTApi() {
    return "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
}

export function requestNewPassword() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${getApiKey()}`;
}

export function updateProfile() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${getApiKey()}`;
}

export function getUserData() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${getApiKey()}`;
}

export function deleteUser() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${getApiKey()}`;
}

export function changePassword() {
    return `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${getApiKey()}`;
}

export async function getToken() {

    let user = JSON.parse(localStorage.getItem("auth"));
    
    let response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${getApiKey()}`, {
        method: "POST",
        content: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: user.refreshToken
        })
    })

    let data = await response.json();
    if (data.error) {
        console.log(data.error);
        window.history.pushState({}, '', `#/logout`);
    }
    return data.access_token;
}



