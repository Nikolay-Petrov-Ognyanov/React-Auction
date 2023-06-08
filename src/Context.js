import { createContext, useEffect, useState } from "react";
import * as service from "./service"

export const Context = createContext()

export function ContextProvider({ children }) {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])

    useEffect(() => {
        service.getUsers().then(result => {
            setUsers(result)
        }).catch(error => console.error(error))

        if (localStorage.getItem("username")) {
            setUser({
                _id: localStorage.getItem("_id"),
                accessToken: localStorage.getItem("accessToken"),
                username: localStorage.getItem("username")
            })
        }
    }, [])

    return (<Context.Provider
        value={{
            user,
            setUser,
            users,
            setUsers
        }}
    >{children}</Context.Provider>)
}