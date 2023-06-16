import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, { payload }) => {
            state.value = payload
        }
    }
})

export const { setUser } = userSlice.actions
export const userReducer = userSlice.reducer