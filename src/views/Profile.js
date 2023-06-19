import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"

export function Profile() {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.value)

    const [isDepositing, setIsDepositing] = useState(true)

    const [input, setInput] = useState({ amount: "" })
    const [error, setError] = useState({ amount: "", server: "" })

    function handleInputChange(event) {
        const { name, value } = event.target

        setInput({ ...input, [name]: value })
        setError({ ...error, server: "" })

        validateInput(event)
    }

    function validateInput(event) {
        const { name, value } = event.target

        setError(state => {
            const stateObject = { ...state, [name]: "" }

            if (name === "amount") {
                if (!value || value == 0) {
                    stateObject[name] = "Amount is required."
                } else if (!Number.isInteger(Number(value))) {
                    stateObject[name] = "Amount must be a whole number."
                } else if (value.length > 10) {
                    stateObject[name] = "Amount can be at most 10 characters long."
                }
            }

            return stateObject
        })
    }

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

        try {
            await service.updateUser({ ...user, wallet: walletToBeUpdated })

            localStorage.setItem("wallet", walletToBeUpdated)

            dispatch(userActions.setUser({ ...user, wallet: walletToBeUpdated }))
            dispatch(usersActions.updateUser({ ...user, wallet: walletToBeUpdated }))
        } catch (error) {
            console.log(error)
        }
    }

    return user && <section>
        <p> Balance: {user.wallet} </p>

        {user.wonAuctions.length > 0 && user.wonAuctions.map(auction => (
            <p key={auction._id}>  {auction.name} </p>
        ))}

        <form onSubmit={handleSubmit} className="amount">
            <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={input.amount}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            {
                !Object.values(error).some(entry => entry !== "") &&
                !Object.values(input).some(entry => entry === "" || entry === 0) &&

                <div className="buttonsWrapper">
                    <button type="submit" onClick={() => setIsDepositing(true)}
                    >Deposit</button>

                    <button type="submit" onClick={() => setIsDepositing(false)}
                    >Withdraw</button>
                </div>
            }
        </form>

        <div className="errorWrapper">
            {error.amount && <p className="error">{error.amount}</p>}
            {error.server && <p className="error">{error.server}</p>}
        </div>
    </section>
}