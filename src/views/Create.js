import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"
import * as localUser from "../localUser"

export function Create() {
    const user = useSelector(state => state.user.value)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [inputs, setInputs] = useState({ name: "", price: "" })
    const [errors, setErrors] = useState({ name: "", price: "", server: "" })

    function handleInputChange(event) {
        const { name, value } = event.target

        setInputs({ ...inputs, [name]: value })
        setErrors({ ...errors, server: "" })

        validateInput(event)
    }

    function validateInput(event) {
        const { name, value } = event.target

        setErrors(state => {
            const stateObject = { ...state, [name]: "" }

            if (name === "name") {
                if (!value) {
                    stateObject[name] = "Name is required."
                } else if (value.length > 10) {
                    stateObject[name] = "Name can be at most 10 characters long."
                }
            } else if (name === "price") {
                if (!value) {
                    stateObject[name] = "Price is required."
                } else if (!Number.isInteger(Number(value))) {
                    stateObject[name] = "Price must be a whole number."
                } else if (value.length > 10) {
                    stateObject[name] = "Price can be at most 10 characters long."
                }
            }

            return stateObject
        })
    }

    async function handleSave(event) {
        event.preventDefault()

        const { name, price } = Object.fromEntries(new FormData(event.target))

        const expirationTime = Date.now() + 5 * 60 * 1000
        const deposit = Math.ceil(price / 20)
        const walletToBeUpdated = user.wallet - deposit
        const userToBeUpdated = { ...user, wallet: walletToBeUpdated }

        const auction = {
            name,
            price,
            deposit,
            expirationTime,
            ownerId: user._id,
            biddersIds: []
        }
        const response = await service.createAuction(auction)

        if (!response.message) {
            await service.updateUser(userToBeUpdated)

            localUser.set({...user, wallet: walletToBeUpdated})

            dispatch(userActions.setUser(userToBeUpdated))
            dispatch(usersActions.updateUser(userToBeUpdated))
            dispatch(auctionsActions.updateAuction(auction))

            navigate("/")
        } else {
            setErrors({ ...errors, server: response.message })
        }
    }

    return (
        <section>
            <form onSubmit={handleSave}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={inputs.name}
                    onChange={handleInputChange}
                    onBlur={validateInput}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={inputs.price}
                    onChange={handleInputChange}
                    onBlur={validateInput}
                />

                {
                    !Object.values(errors).some(entry => entry !== "") &&
                    !Object.values(inputs).some(entry => entry === "") &&

                    <div className="buttonsWrapper">
                        <button type="submit">Save</button>
                        <button type="reset" onClick={() => {
                            setInputs({ name: "", price: 0 })
                        }}> Reset </button>
                    </div>
                }
            </form>

            <div className="errorsWrapper">
                {errors.name && <p className="error">{errors.name}</p>}
                {errors.price && <p className="error">{errors.price}</p>}
                {errors.server && <p className="error">{errors.server}</p>}
            </div>
        </section>
    )
}