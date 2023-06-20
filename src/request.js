async function requester(url, method, data) {
    const accessToken = localStorage.getItem("accessToken")
    const headers = {}

    if (accessToken) { headers["X-Authorization"] = accessToken }

    function makeRequest(url, method, data) {
        if (method === "GET") {
            return fetch(url)
        } else {
            return fetch(url, {
                method,
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        }
    }

    try {
        const response = await makeRequest(url, method, data)

        if (response.message) {
            console.log(response.message)
        } else if (response.status !== 204) {
            return await response.json()
        }
    } catch (error) {
        console.log(error)
    }
}

export function get(url) { return requester(url, "GET") }
export function post(url, data) { return requester(url, "POST", data) }
export function put(url, data) { return requester(url, "PUT", data) }
export function del(url) { return requester(url, "DELETE") }