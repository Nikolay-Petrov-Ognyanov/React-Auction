import { useSelector } from "react-redux"

export function Profile() {
    const user = useSelector(state => state.user.value)

    return user && <section>
        {user.wallet}
    </section>
}