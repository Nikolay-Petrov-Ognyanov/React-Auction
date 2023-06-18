import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service" // Importing a service module
import * as userActions from "../features/user" // Importing user-related actions
import * as usersActions from "../features/users" // Importing users-related actions

export function Profile() {
    const dispatch = useDispatch() // Accessing the Redux dispatch function

    const user = useSelector(state => state.user.value) // Accessing the user state from Redux store

    const [isDepositing, setIsDepositing] = useState(true) // State for tracking deposit/withdrawal

    const [input, setInput] = useState({ amount: 0 }) // State for input values
    const [error, setError] = useState({ amount: "", server: "" }) // State for error messages

    // Handles input change in the form
    function handleInputChange(event) {
        const { name, value } = event.target

        setInput({ ...input, [name]: value })
        setError({ ...error, server: "" })

        validateInput(event)
    }

    // Validates the input values
    function validateInput(event) {
        const { name, value } = event.target

        setError(state => {
            const stateObject = { ...state, [name]: "" }

            if (name === "amount") {
                if (!value) {
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

    // Handles form submission
    async function handleSubmit(event) {
        event.preventDefault()

        const { amount } = Object.fromEntries(new FormData(event.target))

        let walletToBeUpdated = 0

        const userWallet = Number(user.wallet) || 0

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
            console.error(error)
        }
    }

    // Render the component
    return user && <section>
        {user.wallet}

        {user.wonAuctions.length > 0 && user.wonAuctions.map(auction => (
            <p key={auction._id}>  {auction.name} </p>
        ))}

        <form onSubmit={handleSubmit} className="amount">
            <input
                type="number"
                name="amount"
                value={input.amount}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            {
                // Render buttons only when there are no input or validation errors
                !Object.values(error).some(entry => entry !== "") &&
                !Object.values(input).some(entry => entry === "") &&

                <div className="buttonsWrapper">
                    <button type="submit" onClick={() => setIsDepositing(true)}>Deposit</button>
                    <button type="submit" onClick={() => setIsDepositing(false)}>Withdraw</button>
                </div>
            }
        </form>

        <div className="errorWrapper">
            {error.amount && <p className="error">{error.amount}</p>}
            {error.server && <p className="error">{error.server}</p>}
        </div>
    </section>
}