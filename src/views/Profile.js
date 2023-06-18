import { useState } from "react"
import { useSelector } from "react-redux"

export function Profile() {
    const user = useSelector(state => state.user.value)

    const [isDepositing, setIsDepositing] = useState(true)

    function handleSubmit() {
        console.log(isDepositing)
    }

    return user && <section>
        {user.wallet}

        {user.wonAuctions.length > 0 && user.wonAuctions.map(auction => (
            <p key={auction._id}>  {auction.name} </p>
        ))}

        <form onSubmit={handleSubmit} className="transaction">
            <input type="number" name="transaction" />

            <div className="buttonsWrapper">
                <button onClick={() => setIsDepositing(true)}> Deposit </button>
                <button onClick={() => setIsDepositing(false)}> Withdraw </button>
            </div>
        </form>
    </section>
}