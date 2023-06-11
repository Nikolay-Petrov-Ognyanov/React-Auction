import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProperty } from "../features/user"
import { updateUser } from "../features/users"

export function Home() {
    const users = useSelector(state => state.users)
    const user = useSelector(state => state.user.value)
    const index = users.indexOf(u => u._id === user._id)

    const newUser = {
        _id: user._id,
        accessToken: user.accessToken,
        username: "Nikinikiniki",
        index
    }

    const dispatch = useDispatch()


    useEffect(() => {
        console.log(users)
    }, [users])

    function handleChangeUserData() {
        dispatch(addProperty({ key: "newKey", value: "newProp" }))
        dispatch(updateUser(newUser))
    }

    return (<section>
        Home Page

        {users.map(u => <p key={u._id}> {u.username} </p>)}

        <button onClick={handleChangeUserData}> Change User Data </button>
    </section>)
}