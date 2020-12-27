export async function getRequestLogout() {

    localStorage.removeItem("auth");
    this.redirect("/best-recipes/#/login");
}