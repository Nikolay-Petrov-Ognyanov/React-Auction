import { createContext, useEffect, useState } from "react";

export const Context = createContext()

export function ContextProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (localStorage.getItem("user")) {
            setUser(JSON.parse(localStorage.getItem("user")))
        }
    }, [])

    return (<Context.Provider
        value={{
            user,
            setUser
        }}
    >{children}</Context.Provider>)
}