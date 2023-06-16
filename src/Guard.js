import { Navigate, useLocation, Outlet } from "react-router-dom"

export function Guard() {
    const location = useLocation()

    if (!localStorage.getItem("username")) {
        return <Navigate to={"/auth"} replace state={{ from: location }} />
    }

    return <Outlet />
}