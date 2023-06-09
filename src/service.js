import * as request from "./request"

const url = "http://localhost:3030"

export function readData() { return request.get(url) }

export function register(data) {
    return request.post(`${url}/users/register`, data)
}

export function login(data) {
    return request.post(`${url}/users/login`, data)
}

export function logout(data) {
    return request.post(`${url}/users/logout`, data)
}

export function readUsers() {
    return request.get(`${url}/users`)
}

export function updateUser(user) {
    return request.put(`${url}/users/${user._id}`, user)
}

export function createAuction(data) {
    return request.post(`${url}/auctions`, data)
}

export function readAuctions() {
    return request.get(`${url}/auctions`)
}

export function updateAuction(auctionId, data) {
    return request.put(`${url}/auctions/${auctionId}`, data)
}

export function deleteAuction(auctionId) {
    return request.del(`${url}/auctions/${auctionId}`)
}