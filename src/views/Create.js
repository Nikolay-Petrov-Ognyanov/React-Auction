import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import * as service from "../service"

export function Create() {
    const navigate = useNavigate()
    const initialState = { name: "", price: "" }

    const user = useSelector(state => state.user.value)

    const [inputs, setInputs] = useState(initialState)
    const [errors, setErrors] = useState({ ...initialState, server: "" })

    function handleInputChange(event) {
        const { name, value } = event.target

        setInputs(state => ({ ...state, [name]: value }))
        setErrors(state => ({ ...state, server: "" }))

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
                    stateObject[name] = "Name could be at most 10 characters long."
                }
            } else if (name === "price") {
                if (!value) {
                    stateObject[name] = "Price is required."
                } else if (!Number.isInteger(Number(value))) {
                    stateObject[name] = "Price must be a whole number."
                } else if (value.length > 10) {
                    stateObject[name] = "Price must be at most 10 characters long."
                }
            }

            return stateObject
        })
    }

    async function handleSave(event) {
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(event.target))
        const expirationTime = Date.now() + 15 * 60 * 1000
        const auction = { ...formData, expirationTime, ownerId: user._id }

        try {
            await service.createAuction(auction)

            navigate("/")
        } catch (error) {
            setErrors(state => state.server = error.message)
        }
    }

    return (<section>
        <form onSubmit={handleSave}>
            <input
                type="text"
                name="name"
                placeholder="name"
                value={inputs.name}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            <input
                type="number"
                name="price"
                placeholder="price"
                value={inputs.price}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            {
                !Object.values(errors).some(entry => entry !== "") &&
                !Object.values(inputs).some(entry => entry === "") &&

                <div className="buttonsWrapper">
                    <button type="submit">Save</button>
                    <button type="reset" onClick={() => setInputs(initialState)}>Reset</button>
                </div>
            }
        </form>

        <div className="errorsWrapper">
            {errors.name && <p className="error">{errors.name}</p>}
            {errors.price && <p className="error">{errors.price}</p>}
            {errors.server && <p className="error">{errors.server}</p>}
        </div>
    </section>)
}