import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"
import * as localUser from "../localUser"

export function Profile() {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.value)

    const [isDepositing, setIsDepositing] = useState(true)
    const [input, setInput] = useState("")

    function handleInputChange(event) { setInput(event.target.value)}

    async function handleSubmit(event) {
        event.preventDefault()

        const { amount } = Object.fromEntries(new FormData(event.target))
        const userWallet = Number(user.wallet) || 0

        let walletToBeUpdated = 0

        if (isDepositing) {
            walletToBeUpdated = userWallet + Number(amount)

            if (walletToBeUpdated >= 9999999999) {
                walletToBeUpdated = 9999999999
            }
        } else if (!isDepositing) {
            walletToBeUpdated = userWallet - Number(amount)

            if (walletToBeUpdated <= 0 || typeof Number(walletToBeUpdated) !== "number") {
                walletToBeUpdated = 0
            }
        }

        await service.updateUser({ ...user, wallet: walletToBeUpdated })

        localUser.set({ ...user, wallet: walletToBeUpdated })

        dispatch(userActions.setUser({ ...user, wallet: walletToBeUpdated }))
        dispatch(usersActions.updateUser({ ...user, wallet: walletToBeUpdated }))
    }

    function renderUserStats(input) {
        const word = String(input.split(" ")[0])
        const length = user[`${word}Auctions`].length

        if (length > 0) {
            const text = input[0].toUpperCase() + input.slice(1)
            const auction = length === 1 ? " auction." : " auctions."

            return <span className="stats"> {text} {length} {auction} </span>
        }
    }

    return user && <section>
        <div> {renderUserStats("created")} {renderUserStats("sold")} </div>
        <div> {renderUserStats("bid in")} {renderUserStats("won")} </div>

        <p className="balance"> Balance: {user.wallet} </p>

        <form onSubmit={handleSubmit} className="amount">
            <div className="transactionWrapper">
                {!Object.values(input).some(entry => entry === "" || entry === 0) && <button type="submit" className="deposit" onClick={() => setIsDepositing(true)}
                > Deposit </button>}

                <input type="number" name="amount"
                    value={input.amount} onChange={handleInputChange}
                />

                {!Object.values(input).some(entry => entry === "" || entry === 0) && <button type="submit" className="withdraw" onClick={() => setIsDepositing(false)}
                > Withdraw </button>}
            </div>
        </form>
    </section>
}