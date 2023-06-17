import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"

export function Auth() {
    // Initial state for form inputs and errors
    const initialState = { username: "", password: "" }

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

    // State for registration/login toggle
    const [isRegistering, setIsRegistering] = useState(true)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(event.target))

        // Check if form data is valid
        if (!Object.values(formData).some(v => !v.trim())) {
            let response = null

            if (isRegistering) {
                // Register user
                response = await service.register({
                    ...formData,
                    wallet: 10000,
                    wonAuctions: []
                })

                // If username is taken, try logging in
                if (response?.message === "Username is taken.") {
                    response = await service.login(formData)
                }
            } else {
                // Login user
                response = await service.login(formData)
            }

            // Handle successful registration/login
            if (response && !response.message) {
                // Store user data in local storage
                for (let key in response) {
                    if (key === "wonAuctions") {
                        localStorage.setItem(key, JSON.stringify(response[key]))
                    } else {
                        localStorage.setItem(key, response[key])
                    }
                }

                // Update user state in Redux store
                dispatch(userActions.setUser(response))

                // Fetch all users and update user list in Redux store
                const { users } = await service.readUsers()
                dispatch(usersActions.setUsers(users))

                // Add user to user list if not already present
                if (users.length > 0 && !users.find(u => u._id === response._id)) {
                    dispatch(usersActions.addUser(response))
                }

                // Navigate to the main page
                navigate("/")
            } else if (response && response.message) {
                // Set server error message
                setErrors(state => ({ ...state, server: response.message }))
            }
        }
    }

    return (
        <div className="auth">
            <form onSubmit={handleSubmit}>
                {/* Input for username */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={inputs.username}
                    onChange={handleInputChange}
                    onBlur={validateInput}
                />

                {/* Input for password */}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={inputs.password}
                    onChange={handleInputChange}
                    onBlur={validateInput}
                />

                {/* Render buttons if there are no errors and inputs are not empty */}
                {!Object.values(errors).some(entry => entry !== "") && !Object.values(inputs).some(entry => entry === "") && (
                    <div className="buttonsWrapper">
                        <button onClick={() => setIsRegistering(true)}>Register</button>
                        <button onClick={() => setIsRegistering(false)}>Login</button>
                    </div>
                )}
            </form>

            {/* Error messages */}
            <div className="errorsWrapper">
                {errors.username && <p className="error">{errors.username}</p>}
                {errors.password && <p className="error">{errors.password}</p>}
                {errors.server && <p className="error">{errors.server}</p>}
            </div>
        </div>
    )
}