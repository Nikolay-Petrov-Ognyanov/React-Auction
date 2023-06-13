import { createSlice } from "@reduxjs/toolkit"

export const auctionsSlice = createSlice({
    name: "auctions",
    initialState: [],
    reducers: {
        setAuctions: (state, { payload }) => {
            return state = payload
        },
        updateAuction: (state, { payload }) => {
            return state = state.map(a => a._id === payload._id ? payload : a)
        }
    }
})

export const { setAuctions, updateAuction } = auctionsSlice.actions

export const auctionsReducer = auctionsSlice.reducer