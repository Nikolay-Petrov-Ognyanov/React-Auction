import { useContext } from "react"
import { Navigate, useLocation, Outlet } from "react-router-dom"
import { Context } from "./Context"

export function Guard() {
    const { user } = useContext(Context)

    const location = useLocation()

    if (!localStorage.getItem("username")) {
        return <Navigate to={"/auth"} replace state={{ from: location }} />
    }

    return <Outlet />
}