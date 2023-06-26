import { useNavigate, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../features/user"
import * as service from "../service"
import * as localUser from "../localUser"

export function Nav() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.user.value)

    async function handleLogout() {
        await service.logout({ accessToken: user.accessToken })

        dispatch(setUser(null))

        localStorage.clear()

        navigate("/auth")
    }

    return <> {localUser.get() ? <nav>
        <NavLink to={"/"} className="button" activeclassname="active">Auction</NavLink>
        <NavLink to={"/create"} className="button" activeclassname="active">Create</NavLink>
        <NavLink to={"/profile"} className="button" activeclassname="active">Profile</NavLink>

        <button onClick={handleLogout}>Logout</button>
    </nav> : <h1>Sign in</h1>} </>
}