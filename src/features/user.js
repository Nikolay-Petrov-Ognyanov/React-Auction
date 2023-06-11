import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload
        },
        addProperty: (state, action) => {
            state.value[action.payload.key] = action.payload.value
        }
    }
})

export const { setUser, addProperty } = userSlice.actions

export const userReducer = userSlice.reducer