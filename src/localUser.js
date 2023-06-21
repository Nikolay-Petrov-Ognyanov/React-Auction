export function set(user) {
    localStorage.setItem("user", JSON.stringify(user))
}

export function get() {
    return JSON.parse(localStorage.getItem("user"))
}