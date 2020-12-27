import { domainName } from "../../utils/itemUtil.js"

export async function getRequestLogout() {

    localStorage.removeItem("auth");
    this.redirect("/#/login");
}