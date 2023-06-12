import { createSlice } from "@reduxjs/toolkit"

export const usersSlice = createSlice({
    name: "users",
    initialState: [],
    reducers: {
        setUsers: (state, { payload }) => {
            return state = payload
        },
        addUser: (state, { payload }) => {
            state.push(payload)
        },
        updateUser: (state, { payload }) => {
            return state = state.map(u => u._id === payload._id ? payload : u)
        }
    }
})

export const { setUsers, addUser, updateUser } = usersSlice.actions

export const usersReducer = usersSlice.reducer