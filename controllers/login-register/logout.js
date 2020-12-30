export async function getRequestLogout() {

    localStorage.removeItem("auth");
    this.redirect("#/login");
}