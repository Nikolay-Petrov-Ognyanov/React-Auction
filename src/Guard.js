import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"

export function Guard() {
    const user = useSelector(state => state.user.value)

    const location = useLocation()

    if (!user) {
        return <Navigate to={"/auth"} replace state={{ from: location }} />
    }

    return <Outlet />
}