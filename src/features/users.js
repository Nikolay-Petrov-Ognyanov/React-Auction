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
            const { index, ...updatedUser } = action.payload

            // console.log(index)

            state.splice(index, 1, updatedUser)
        }
    }
})

export const { addUser, updateUser: updatedUser } = usersSlice.actions

export const usersReducer = usersSlice.reducer