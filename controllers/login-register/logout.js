export async function getRequestLogout() {
    if (localStorage.auth) {
        localStorage.removeItem("auth");
    }
    this.redirect("#/login");
}