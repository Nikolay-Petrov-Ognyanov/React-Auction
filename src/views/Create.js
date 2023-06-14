import { useState } from "react"
import * as service from "../service"

export function Create() {
    const [inputs, setInputs] = useState({
        name: "",
        price: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        price: "",
    })

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
                } else if (value.length < 2 || value.length > 5) {
                    stateObject[name] = "Name must be between 2 and 5 characters long."
                }
            } else if (name === "price") {
                if (!value) {
                    stateObject[name] = "Price is required."
                } else if (!Number.isInteger(Number(value))) {
                    stateObject[name] = "Price must be a whole number."
                } else if (value.length > 5) {
                    stateObject[name] = "Price must be at most 5 characters long."
                }
            }

            return stateObject
        })
    }

    async function handleSave(event) {
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(event.target))
        const expirationTime = Date.now() + 15 * 60 * 1000
        const auction = { ...formData, expirationTime }
        const result = await service.createAuction(auction)

        console.log(result)
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
                    <button type="reset">Reset</button>
                </div>
            }
        </form>

        <div className="errorsWrapper">
            {errors.name && <p className="error">{errors.name}</p>}
            {errors.price && <p className="error">{errors.price}</p>}
        </div>
    </section>)
}