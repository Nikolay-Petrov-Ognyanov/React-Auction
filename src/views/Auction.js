import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"

export function Auction() {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.value)
    const users = useSelector(state => state.users)
    const auctions = useSelector(state => state.auctions)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const result = await service.readUsers()

                dispatch(usersActions.setUsers(result.users))
            } catch (error) {
                console.error(error)
            }
        }

        fetchUsers()
    }, [dispatch])

    useEffect(() => {
        async function fetchAuctions() {
            try {
                const result = await service.readAuctions()
                const { auctions } = result

                auctions.forEach(async auction => {
                    if (auction.expirationTime > Date.now()) return

                    const tax = auction.price / 20 - auction.deposit
                    const amountToBePaidToSeller = auction.price - tax
                    const seller = users.find(u => u._id === auction.ownerId)
                    // const buyer = users.find(u => u._id === auction.highestBidderId)

                    const sellerToBePaid = {
                        ...seller,
                        wallet: seller.wallet + amountToBePaidToSeller
                    }

                    await service.updateUser(sellerToBePaid)
                    await service.deleteAuction(auction._id)

                    if (user._id === seller._id) {
                        dispatch(userActions.setUser(sellerToBePaid))
                    }

                    dispatch(usersActions.updateUser(sellerToBePaid))
                    dispatch(auctionsActions.deleteAuction(auction._id))
                })

                dispatch(auctionsActions.setAuctions(auctions))
            } catch (error) {
                console.error(error)
            }
        }

        fetchAuctions()

        const interval = setInterval(fetchAuctions, 1000)

        return () => clearInterval(interval)
    }, [dispatch, user?._id, users])

    function formatTime(time) {
        const minutes = Math.floor(time / 60000)
        const seconds = Math.floor((time % 60000) / 1000)
        const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

        return { minutes, seconds, clock }
    }

    function updateExpirationTime(time) {
        return formatTime(time - Date.now()).minutes < 4 ? time + 60 * 1000 : time
    }

    function updateBiddersIds(biddersIds, userId) {
        return !biddersIds.includes(userId) ? [...biddersIds, userId] : biddersIds
    }

    function calculateBid(price) {
        let bid = Math.round(price / 5) * 5 + 5

        if (price >= 100 && price < 200) bid = Math.round(price / 10) * 10 + 10
        if (price >= 200 && price < 500) bid = Math.round(price / 10) * 10 + 20
        if (price >= 500 && price < 1000) bid = Math.round(price / 10) * 10 + 50
        if (price >= 1000) bid = price + 100

        return bid
    }

    async function handleBid(auctionId, price) {
        try {
            const bid = calculateBid(price)
            const auctionFromServer = auctions.find(a => a._id === auctionId)
            const previousBidder = users.find(u => u._id === auctionFromServer.highestBidderId)

            if (previousBidder) {
                const previousBidderToBeRepaid = {
                    ...previousBidder,
                    wallet: previousBidder.wallet + auctionFromServer.price
                }

                await service.updateUser(previousBidderToBeRepaid)

                dispatch(usersActions.updateUser(previousBidderToBeRepaid))
            }

            const auctionToBeUpdated = {
                ...auctionFromServer,
                price: bid,
                expirationTime: updateExpirationTime(auctionFromServer.expirationTime),
                biddersIds: updateBiddersIds(auctionFromServer.biddersIds, user._id),
                highestBidderId: user._id,
                previousBidderId: auctionFromServer.highestBidderId || ""
            }

            const highestBidderToBeUpdated = {
                ...user,
                wallet: user.wallet - Math.ceil(bid)
            }

            await service.updateAuction(auctionId, auctionToBeUpdated)
            await service.updateUser(highestBidderToBeUpdated)

            dispatch(userActions.setUser(highestBidderToBeUpdated))
            dispatch(usersActions.updateUser(highestBidderToBeUpdated))
            dispatch(auctionsActions.updateAuction(auctionToBeUpdated))
        } catch (error) {
            console.error(error)
        }
    }

    async function handleCancel(auctionId) {
        const auction = auctions.find(a => a._id === auctionId)

        if (auction) {
            const highestBidder = users.find(u => u._id === auction.highestBidderId)

            const highestBidderToBeRepaid = {
                ...highestBidder,
                wallet: highestBidder.wallet + auction.price
            }

            await service.updateUser(highestBidderToBeRepaid)
            await service.deleteAuction(auctionId)

            if (user._id === highestBidderToBeRepaid._id) {
                dispatch(userActions.setUser(highestBidderToBeRepaid))
            }

            dispatch(usersActions.updateUser(highestBidderToBeRepaid))
            dispatch(auctionsActions.deleteAuction(auctionId))
        }
    }

    return <section> {auctions.map(a => <div className="auctionCard" key={a._id}>
        <div className="cardInfo">
            <p className="auctionName"> {a.name} </p>

            <p className="auctionDuration">
                {formatTime(a.expirationTime - Date.now()).clock}
            </p>

            <p className="auctionPrice">
                {user._id === a.ownerId && a.price}
                {user._id !== a.ownerId && calculateBid(a.price)}
            </p>
        </div>

        {user._id !== a.highestBidderId && user._id !== a.ownerId && <button
            className="cardButton" onClick={() => handleBid(a._id, a.price)}
        > Bid </button>}

        {user._id === a.ownerId && <button
            className="cardButton" onClick={() => handleCancel(a._id)}
        > Cancel </button>}
    </div>)} </section >
}