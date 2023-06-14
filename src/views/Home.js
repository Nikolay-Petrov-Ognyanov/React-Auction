import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"

export function Home() {
    const user = useSelector(state => state.user.value)
    const auctions = useSelector(state => state.auctions)

    const dispatch = useDispatch()

    useEffect(() => {
        service.readUsers().then(
            result => {
                const { users } = result

                dispatch(usersActions.setUsers(users))
            }
        ).catch(error => console.log(error.message))

        const interval = setInterval(() => {
            service.readAuctions().then(result => {
                const { auctions } = result

                auctions.forEach(auction => {
                    if (auction.expirationTime > Date.now()) return

                    service.deleteAuction(auctions._id).then(
                        dispatch(auctionsActions.deleteAuction(auction._id))
                    ).catch(error => console.log(error.message))
                })

                dispatch(auctionsActions.setAuctions(auctions))
            })
        }, 10000)

        return () => clearInterval(interval)
    }, [dispatch])

    function minutes(time) {
        return time / (60 * 1000)
    }

    async function handleBid(auctionId, price) {
        try {
            let bid = price + 5

            if (price >= 100 && price < 200) {
                bid = price + 10
            }

            if (price >= 200 && price < 500) {
                bid = price + 20
            }

            if (price >= 500 && price < 1000) {
                bid = price + 50
            }

            if (price >= 1000) {
                bid = price + 100
            }

            const auction = {
                ...auctions.find(a => a._id === auctionId),
                price: bid,
                bidderId: user._id
            }

            const result = await service.updateAuction(auctionId, auction)

            dispatch(auctionsActions.updateAuction(result))
        } catch (error) {
            console.log(error.message.message)
        }
    }

    return (<section>
        Home Page

        {auctions.map(a => <div className="auctionCard" key={a._id}>
            <div className="cardInfo">
                <p className="auctionName">
                    {a.name}
                </p>

                <p className="auctionDuration">
                    <span className="short">{
                        minutes(Math.floor(a.expirationTime - Date.now())) < 5 && "Short"
                    }</span>

                    <span className="medium">{
                        minutes(Math.floor(a.expirationTime - Date.now())) >= 5 &&
                        minutes(Math.floor(a.expirationTime - Date.now())) < 10 && "Medium"
                    }</span>

                    <span className="long">{
                        minutes(Math.floor(a.expirationTime - Date.now())) >= 10 && "Long"
                    }</span>
                </p>

                <p className="auctionPrice">
                    {a.price}
                </p>
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