import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"

export function Home() {
    const users = useSelector(state => state.users)
    const user = useSelector(state => state.user.value)
    const dispatch = useDispatch()

    useEffect(() => {
        service.readUsers().then(
            result => {
                const { users } = result

                dispatch(usersActions.setUsers(users))
            }
        ).catch(error => console.error(error))
    }, [dispatch])


    const newUser = { ...user, username: "Nikinikiniki" }

    function handleChangeUsername() {
        dispatch(userActions.addProperty({ key: "newKey", value: "newProp" }))
        dispatch(usersActions.updateUser(newUser))
    }

    return (<section>
        Home Page

        {users.map(u => <p key={u._id}> {u.username} </p>)}

        <button onClick={handleChangeUsername}> Change Username </button>
    </section>)
}