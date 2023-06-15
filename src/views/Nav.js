import { useNavigate, NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setUser } from "../features/user"
import * as service from "../service"

export function Nav() {
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleLogout() {
        await service.logout({ accessToken: user.accessToken })

        dispatch(setUser({}))

        localStorage.clear()

        navigate("/auth")
    }

    return (<> {user?.accessToken ? <nav>
        <NavLink to={"/"} className="button" activeclassname="active">Auction</NavLink>
        <NavLink to={"/create"} className="button" activeclassname="active">Create</NavLink>
        <NavLink to={"/profile"} className="button" activeclassname="active">Profile</NavLink>
        <button onClick={handleLogout}>Logout</button>
    </nav> : <h1>Sign in</h1>} </>)
}