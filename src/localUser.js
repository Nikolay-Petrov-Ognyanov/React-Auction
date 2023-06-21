export function set(user) {
    localStorage.setItem("user", JSON.stringify(user))
}

export function get(key) {
    const localUser = JSON.parse(localStorage.getItem("user"))

    return localUser && key ? localUser[key] : localUser
}