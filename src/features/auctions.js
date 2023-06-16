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
        },
        deleteAuction: (state, { payload }) => {
            return state = state.filter(a => a._id !== payload)
        }
    }
})

export const { setAuctions, updateAuction, deleteAuction } = auctionsSlice.actions
export const auctionsReducer = auctionsSlice.reducer