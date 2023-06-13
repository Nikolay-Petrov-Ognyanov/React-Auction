import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"

export function Home() {
    const auctions = useSelector(state => state.auctions)

    const dispatch = useDispatch()

    useEffect(() => {
        service.readUsers().then(
            result => {
                const { users } = result

                dispatch(usersActions.setUsers(users))
            }
        ).catch(error => console.error(error.message))

        service.readAuctions().then(
            result => {
                const { auctions } = result

                dispatch(auctionsActions.setAuctions(auctions))
            }
        )
    }, [dispatch])

    function hours(time) {
        return time / (60 * 60 * 1000)
    }

    async function handleBid(auctionId, price) {
        try {
            let bid = Math.round(price + price * 0.05)

            if (bid === price) {
                bid = price + 1
            }

            const auction = { ...auctions.find(a => a._id === auctionId), price: bid }

            const result = await service.createBid(auctionId, auction)

            console.log(result)

            dispatch(auctionsActions.updateAuction(result))
        } catch (error) {
            console.error(error.message.message)
        }
    }

    return (<section>
        Home Page

        {auctions.map(a => <div className="auctionCard" key={a._id}>
            <div className="cardInfo">
                <p className="auctionName"> Name: {a.name} </p>

                <p className="auctionDuration">
                    Duration: {" "}

                    <span className="short">
                        {hours(Math.abs(a.expirationTime - Date.now())) < 8 && "Short"}
                    </span>

                    <span className="medium">
                        {hours(Math.abs(a.expirationTime - Date.now())) < 16 && "Medium"}
                    </span>

                    <span className="long">
                        {hours(Math.abs(a.expirationTime - Date.now())) > 16 && "Long"}
                    </span>
                </p>

                <p className="auctionPrice"> Current bid: {a.price} </p>
            </div>

            <button
                type="submit"
                className="bidButton"
                onClick={() => handleBid(a._id, a.price)}
            > Bid </button>
        </div>)
        }
    </section >)
}