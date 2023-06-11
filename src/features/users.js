import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

export const usersSlice = createSlice({
    name: "users",
    initialState: [],
    reducers: {
        addUser: (state, action) => {
            state.push(action.payload)
        },
        updateUser: (state, action) => {
            const entries = Object.entries(action.payload).filter(a => a[0] !== "index")

            const newUser = {}

            for (let entry of entries) {
                newUser[entry[0]] = entry[1]
            }

            state.splice(action.payload.index, 1, newUser)
        }
    }
})

export const { addUser, updateUser } = usersSlice.actions

export const usersReducer = usersSlice.reducer