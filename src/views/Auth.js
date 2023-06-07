import { useContext, useState } from "react"
import * as service from "../service"
import { Context } from "../Context"
import { useNavigate } from "react-router-dom"

export default function Auth() {
    const { setUser } = useContext(Context)

    const [isRegistering, setIsRegistering] = useState(true)

    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate()

    function handleInputChange(event) {
        const { name, value } = event.target

        setInputs(state => ({ ...state, [name]: value }))

        validateInput(event)
    }

    function validateInput(event) {
        const { name, value } = event.target

        setErrors(state => {
            const stateObject = { ...state, [name]: "" }

            if (name === "username") {
                if (!value) {
                    stateObject[name] = "Username is required."
                } else if (value.length < 2) {
                    stateObject[name] = "Username must be at least 2 characters long."
                }
            } else if (name === "password") {
                if (!value) {
                    stateObject[name] = "Password is required."
                } else if (value.length < 5) {
                    stateObject[name] = "Password must be at least 5 characters long."
                }
            }

            return stateObject
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(event.target))

        if (!Object.values(formData).some(v => !v.trim())) {
            let userData = null

            if (isRegistering) {
                userData = await service.register(formData)
            } else {
                userData = await service.login(formData)
            }

            if (userData) {
                for (let key in userData) {
                    localStorage.setItem(key, userData[key])
                }

                setUser(userData)

                navigate("/")
            }
        }
    }

    return (<div className="auth">
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={inputs.username}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleInputChange}
                onBlur={validateInput}
            />

            {
                !Object.values(errors).some(entry => entry !== "") &&
                !Object.values(inputs).some(entry => entry === "") &&

                <div className="buttonsWrapper">
                    <button onClick={() => setIsRegistering(true)}>Register</button>
                    <button onClick={() => setIsRegistering(false)}>Login</button>
                </div>
            }
        </form>

        <div className="errorsWrapper">
            {errors.username && <p className="error">{errors.username}</p>}
            {errors.password && <p className="error">{errors.password}</p>}
        </div>
    </div>)
}