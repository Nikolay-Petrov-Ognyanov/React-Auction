import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"

export function Auction() {
    const dispatch = useDispatch()

    useEffect(() => {
        service.readUsers().then(result => {
            const { users } = result

            dispatch(usersActions.setUsers(users))
        }).catch(error => console.log(error.message))
    }, [dispatch])

    useEffect(() => {
        function fetchData() {
            service.readAuctions().then(result => {
                const { auctions } = result

                auctions.forEach(auction => {
                    if (auction.expirationTime > Date.now()) return

                    service.deleteAuction(auction._id).then(
                        dispatch(auctionsActions.deleteAuction(auction._id))
                    )
                })

                dispatch(auctionsActions.setAuctions(auctions))
            })
        }

        fetchData()

        const interval = setInterval(fetchData, 1000)

        return () => clearInterval(interval)
    }, [dispatch])

    const user = useSelector(state => state.user.value)
    const auctions = useSelector(state => state.auctions)

    function minutes(time) {
        return time / (60 * 1000)
    }

    function updateExpirationTime(time) {
        if (minutes(time - Date.now()) < 10) return time + 5 * 60 * 1000

        return time
    }

    function updatebiddersIdsArray(biddersIds, userId) {
        if (!biddersIds.includes(userId)) return [...biddersIds, userId]

        return biddersIds
    }

    async function handleBid(auctionId, price) {
        try {
            let bid = Math.round(price / 5) * 5 + 5

            if (price >= 100 && price < 200) bid = Math.round(price / 10) * 10 + 10
            if (price >= 200 && price < 500) bid = Math.round(price / 10) * 10 + 20
            if (price >= 500 && price < 1000) bid = Math.round(price / 10) * 10 + 50
            if (price >= 1000) bid = price + 100

            const auctionFromServer = auctions.find(a => a._id === auctionId)

            const auctionToBeUpdated = {
                ...auctionFromServer,
                price: bid,
                expirationTime: updateExpirationTime(auctionFromServer.expirationTime),
                biddersIds: updatebiddersIdsArray(auctionFromServer.biddersIds, user._id),
                highestBidderId: user._id,
            }

            await service.updateAuction(auctionId, auctionToBeUpdated)

            dispatch(auctionsActions.updateAuction(auctionToBeUpdated))
        } catch (error) {
            console.log(error.message)
        }
    }

    async function handleCancel(auctionId) {
        if (auctions.find(a => a._id === auctionId)) {
            await service.deleteAuction(auctionId)

            dispatch(auctionsActions.deleteAuction(auctionId))
        }
    }

    return (<section> {auctions.map(a => <div className="auctionCard" key={a._id}>
        <div className="cardInfo">
            <p className="auctionName"> {a.name} </p>

            <p className="auctionDuration">
                <span className="short"> {
                    minutes(Math.floor(a.expirationTime - Date.now())) < 5 && "Short"
                } </span>

                <span className="medium"> {
                    minutes(Math.floor(a.expirationTime - Date.now())) >= 5 &&
                    minutes(Math.floor(a.expirationTime - Date.now())) < 10 && "Medium"
                } </span>

                <span className="long"> {
                    minutes(Math.floor(a.expirationTime - Date.now())) >= 10 && "Long"
                } </span>
            </p>

            <p className="auctionPrice"> {a.price} </p>
        </div>

        {user._id !== a.highestBidderId && user._id !== a.ownerId && <button
            className="cardButton" onClick={() => handleBid(a._id, a.price)}
        > Bid </button>}

        {user._id === a.ownerId && <button
            className="cardButton" onClick={() => handleCancel(a._id)}
        > Cancel </button>}
    </div>)} </section >)
}