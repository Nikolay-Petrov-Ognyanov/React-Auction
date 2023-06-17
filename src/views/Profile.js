import { useSelector } from "react-redux"

export function Profile() {
    const user = useSelector(state => state.user.value)

    console.log(user)

    return user && <section>
        {user.wallet}

        {user.wonAuctions.map(auction => (
            <p key={auction._id}>  {auction.name} </p>
        ))}
    </section>
}