import { useEffect } from "react"
import { useSelector } from "react-redux"

export function Home() {
    const users = useSelector(state => state.users)

    useEffect(() => {
        console.log(users)
    }, [users])

    return (<section>
        Home Page

        {users.map(u => <p key={u._id}> {u.username} </p>)}
    </section>)
}