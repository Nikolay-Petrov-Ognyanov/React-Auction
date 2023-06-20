import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"

export function Auth() {
    const initialState = { username: "", password: "" }

    const [inputs, setInputs] = useState(initialState)
    const [errors, setErrors] = useState({ ...initialState, server: "" })

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

    const [isRegistering, setIsRegistering] = useState(true)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(event.target))

        if (!Object.values(formData).some(v => !v.trim())) {
            let response = null

            if (isRegistering) {
                response = await service.register({
                    ...formData,
                    wallet: 10000,
                    wonAuctions: []
                })

                if (response?.message === "Username is taken.") {
                    response = await service.login(formData)
                }
            } else {
                response = await service.login(formData)
            }

            if (response && !response.message) {
                if (response.wallet <= 0) {
                    response = { ...response, wallet: 10000 }

                    await service.updateUser(response)
                }

                for (let key in response) {
                    if (key === "wonAuctions") {
                        localStorage.setItem(key, JSON.stringify(response[key]))
                    } else {
                        localStorage.setItem(key, response[key])
                    }
                }

                dispatch(userActions.setUser(response))

                const { users } = await service.readUsers()
                dispatch(usersActions.setUsers(users))

                if (users.length > 0 && !users.find(u => u._id === response._id)) {
                    dispatch(usersActions.addUser(response))
                }

                navigate("/")
            } else if (response && response.message) {
                setErrors(state => ({ ...state, server: response.message }))
            }
        }
    }

    return (
        <div className="auth">
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

                {!Object.values(errors).some(entry => entry !== "") && !Object.values(inputs).some(entry => entry === "") && (
                    <div className="buttonsWrapper">
                        <button onClick={() => setIsRegistering(true)}>Register</button>
                        <button onClick={() => setIsRegistering(false)}>Login</button>
                    </div>
                )}
            </form>

            <div className="errorsWrapper">
                {errors.username && <p className="error">{errors.username}</p>}
                {errors.password && <p className="error">{errors.password}</p>}
                {errors.server && <p className="error">{errors.server}</p>}
            </div>
        </div>
    )
}