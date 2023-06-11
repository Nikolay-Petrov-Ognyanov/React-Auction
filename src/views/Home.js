import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProperty } from "../features/user"
import { updatedUser } from "../features/users"

export function Home() {
    const users = useSelector(state => state.users)
    const user = useSelector(state => state.user.value)

    const index = users.map(u => u._id).indexOf(user._id)
    const newUser = { ...user, index, username: "Nikinikiniki" }

    const dispatch = useDispatch()

    function handleChangeUsername() {
        console.log(index)

        dispatch(addProperty({ key: "newKey", value: "newProp" }))
        dispatch(updatedUser(newUser))
    }

    return (<section>
        Home Page

        {users.map(u => <p key={u._id}> {u.username} </p>)}

        <button onClick={handleChangeUsername}> Change Username </button>
    </section>)
}