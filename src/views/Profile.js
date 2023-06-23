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

    function handleInputChange(event) { setInput(event.target.value) }

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

        setInput("")
    }

    function renderUserStats() {
        const created = user.createdAuctions.length && `created ${user.createdAuctions.length}`
        const sold = user.soldAuctions.length && `sold ${user.soldAuctions.length}`
        const bid = user.bidAuctions.length && `bid in ${user.bidAuctions.length}`
        const won = user.wonAuctions.length && `won ${user.wonAuctions.length}`

        let array = [created, sold, bid, won].filter(entry => entry !== 0)

        if (array[0]) {
            const word = array[0][0].toUpperCase() + array[0].slice(1)
            const auction = array[0].slice(-1) === "1" ? " auction" : " auctions"
            const string = word + auction

            array.splice(0, 1, string)
        }

        if (array.length > 1) {
            const string = ` and ${array[array.length - 1]}`

            array.splice(array.length - 1, 1, string)
        }

        if (array.length > 2) {
            for (let i = 0; i < array.length - 2; i++) {
                array[i] = array[i] && array[i] + ", "
            }
        }

        array[array.length - 1] = array[array.length - 1] + "."

        if (array.length === 4) {
            return <>
                <p> {array[0]} {array[1]} </p>
                <p> {array[2]} {array[3]} </p>
            </>
        }

        return <p> {array} </p>
    }

    return user && <section className="profile">
        <h1> {user.username} </h1>

        <div className="renderUserStats"> {renderUserStats()} </div>

        <form onSubmit={handleSubmit} className="amount">
            <div className="transactionWrapper">
                <button type="submit" className="deposit"
                    onClick={() => setIsDepositing(true)}
                > Deposit </button>

                <input type="number" name="amount" placeholder={"Balance: " + user.wallet}
                    value={input} onChange={handleInputChange}
                />

                <button type="submit" className="withdraw"
                    onClick={() => setIsDepositing(false)}
                > Withdraw </button>
            </div>
        </form>
    </section>
}