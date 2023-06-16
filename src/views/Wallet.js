import { useSelector } from "react-redux"


export function Wallet() {
    const user = useSelector(state => state.user.value)

    return user && <section>
        {user.wallet}
    </section>
}