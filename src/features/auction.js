import { createSlice } from "@reduxjs/toolkit"

const auctionSlice = createSlice({
    name: "auction",
    initialState: {},
    reducers: {
        setAuction: (state, { payload }) => {
            state = payload
        }
    }
})

export const { setAuction } = auctionSlice.actions

export const auctionReducer = auctionSlice.reducer