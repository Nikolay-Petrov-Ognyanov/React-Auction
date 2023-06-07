import * as request from "./request"

const url = "http://localhost:3030"

export function getData() { return request.get(url) }

export function register(data) {
    return request.post(`${url}/users/register`, data)
}

export function login(data) {
    return request.post(`${url}/users/login`, data)
}

export function logout(data) {
    return request.post(`${url}/users/logout`, data)
}