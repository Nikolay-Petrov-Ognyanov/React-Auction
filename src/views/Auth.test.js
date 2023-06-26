import { Auth } from "./Auth"
import { render, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import { MemoryRouter } from "react-router-dom"

const mockStore = configureStore([])
const store = mockStore({})

test("validates input fields", () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <MemoryRouter>
                <Auth />
            </MemoryRouter>
        </Provider>
    )

    const usernameInput = getByPlaceholderText("Username")
    const passwordInput = getByPlaceholderText("Password")

    fireEvent.change(usernameInput, { target: { value: "a" } })
    fireEvent.change(passwordInput, { target: { value: "1234" } })

    const usernameError = getByText("Username must be between 2 and 20 characters long.")
    const passwordError = getByText("Password must be at least 5 characters long.")

    expect(usernameError).toBeInTheDocument()
    expect(passwordError).toBeInTheDocument()

    fireEvent.change(usernameInput, { target: { value: "validusername" } })
    fireEvent.change(passwordInput, { target: { value: "validpassword" } })

    expect(usernameError).not.toBeInTheDocument()
    expect(passwordError).not.toBeInTheDocument()
})