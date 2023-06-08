import { useContext } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { Context } from "../Context"
import * as service from "../service"

export function Nav() {
    const { user, setUser } = useContext(Context)

    const navigate = useNavigate()

    async function handleLogout() {
        await service.logout(localStorage.getItem("accessToken"))

        setUser(null)

        localStorage.clear()

        navigate("/auth")
    }

    return (<> {user ? <nav>
        <NavLink to={"/"} className="button" activeclassname="active">Home</NavLink>
        <NavLink to={"/create"} className="button" activeclassname="active">Create</NavLink>
        <NavLink to={"/profile"} className="button" activeclassname="active">Profile</NavLink>
        <button onClick={handleLogout}>Logout</button>
    </nav> : <h1>Auction</h1>} </>)
}