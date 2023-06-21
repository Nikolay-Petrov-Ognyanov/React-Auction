import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as service from "../service"
import * as userActions from "../features/user"
import * as usersActions from "../features/users"
import * as auctionsActions from "../features/auctions"
import * as localUser from "../localUser"

export function Auction() {
	const dispatch = useDispatch()

	const user = useSelector(state => state.user.value)
	const users = useSelector(state => state.users)
	const auctions = useSelector(state => state.auctions)

	const [activeButton, setActiveButton] = useState("")

	useEffect(() => {
		async function fetchUsers() {
			dispatch(usersActions.setUsers(await service.readUsers().users))
		}

		fetchUsers()
	}, [dispatch])

	useEffect(() => {
		async function fetchAuctions() {
			const result = await service.readAuctions()
			const { auctions } = result

			auctions.forEach(async auction => {
				if (auction.expirationTime > Date.now()) return

				const buyer = users.find(u => u._id === auction.highestBidderId)

				if (buyer && !buyer.wonAuctions.includes(auction)) {
					const seller = users.find(u => u._id === auction.ownerId)
					const tax = Math.ceil(auction.lastBid / 20) - auction.deposit
					const amountToBePaidToSeller = auction.lastBid - tax

					function updateSoldAuctions() {
						if (seller.soldAuctions.includes(auction._id)) {
							return seller.soldAuctions
						} else {
							return [...seller.soldAuctions, auction._id]
						}
					}

					const sellerToBePaid = {
						...seller,
						wallet: seller.wallet + amountToBePaidToSeller,
						soldAuctions: updateSoldAuctions()
					}

					function updateWonAuctions() {
						if (buyer.wonAuctions.includes(auction._id)) {
							return buyer.wonAuctions
						} else {
							return [...buyer.wonAuctions, auction._id]
						}
					}

					const buyerToBeAwarded = {
						...buyer,
						wonAuctions: updateWonAuctions()
					}

					await service.updateUser(sellerToBePaid)
					await service.updateUser(buyerToBeAwarded)

					if (user._id === seller._id) {
						dispatch(userActions.setUser(sellerToBePaid))
					} else if (user._id === buyer._id) {
						dispatch(userActions.setUser(buyerToBeAwarded))

						localUser.set(buyerToBeAwarded)
					}

					dispatch(usersActions.updateUser(sellerToBePaid))
					dispatch(usersActions.updateUser(buyerToBeAwarded))
				}

				await service.deleteAuction(auction._id)

				dispatch(auctionsActions.deleteAuction(auction._id))
			})

			if (localUser.get("sortingCriteria")) {
				const [name, order] = localUser.get("sortingCriteria")

				setActiveButton(name)

				dispatch(auctionsActions.setAuctions(sortAuctions(auctions, name, order)))
			} else {
				dispatch(auctionsActions.setAuctions(auctions))
			}
		}

		fetchAuctions()

		const interval = setInterval(fetchAuctions, 1000)

		return () => clearInterval(interval)
	}, [dispatch, user?._id, user?.soldAuctions, users])

	function handleSorting(criteria) {
		setActiveButton(criteria)

		let order = "A-Z"

		if (localUser.get("sortingCriteria")) {
			const storedCriteria = localUser.get("sortingCriteria")

			if (storedCriteria[0] === criteria && storedCriteria[1] === "A-Z") {
				order = "Z-A"
			}
		}

		localUser.set({ ...user, sortingCriteria: [criteria, order] })

		sortAuctions(auctions, criteria, order)

		dispatch(auctionsActions.setAuctions(sortAuctions(auctions, criteria, order)))
	}

	function sortAuctions(auctions, name, order) {
		if (name === "name") {
			if (order === "A-Z") {
				return [...auctions].sort((a, z) => a.name.localeCompare(z.name))
			} else {
				return [...auctions].sort((a, z) => z.name.localeCompare(a.name))
			}
		} else if (name === "duration") {
			if (order === "A-Z") {
				return [...auctions].sort((a, z) => {
					return a.expirationTime - z.expirationTime
				})
			} else {
				return [...auctions].sort((a, z) => {
					return z.expirationTime - a.expirationTime
				})
			}
		} else if (name === "price") {
			if (order === "A-Z") {
				return [...auctions].sort((a, z) => a.price - z.price)
			} else {
				return [...auctions].sort((a, z) => z.price - a.price)
			}
		} else if (name === "action") {
			const ownAuctions = [...auctions].filter(a => a.ownerId === user._id)

			const availableAuctions = [...auctions].filter(
				a => a.highestBidderId !== user._id && a.ownerId !== user._id
			)

			const bidAuctions = [...auctions].filter(a => a.highestBidderId === user._id)

			if (order === "A-Z") {
				return [...availableAuctions, ...ownAuctions, ...bidAuctions]
			} else {
				return [...ownAuctions, ...availableAuctions, ...bidAuctions]
			}
		}
	}

	function formatTime(time) {
		const minutes = Math.floor(time / 60000)
		const seconds = Math.floor((time % 60000) / 1000)
		const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

		return { minutes, seconds, clock }
	}

	function updateExpirationTime(time) {
		return formatTime(time - Date.now()).minutes < 4 ? time + 60 * 1000 : time
	}

	function calculateNextPrice(price) {
		let nextPrice = Math.round(price / 5) * 5 + 5

		if (price >= 100 && price < 200) nextPrice = Math.round(price / 10) * 10 + 10
		if (price >= 200 && price < 500) nextPrice = Math.round(price / 10) * 10 + 20
		if (price >= 500 && price < 1000) nextPrice = Math.round(price / 10) * 10 + 50
		if (price >= 1000) nextPrice = price + 100

		return nextPrice
	}

	function renderBidButton(auction) {
		if (
			user._id !== auction.highestBidderId &&
			user._id !== auction.ownerId &&
			user.wallet >= auction.price
		) {
			return <button className="cardButton"
				onClick={() => handleBid(auction._id, auction.price)}
			> Bid </button>
		}

		return null
	}

	async function handleBid(auctionId, price) {
		if (user.wallet < price) return

		const nextPrice = calculateNextPrice(price)
		const auctionFromServer = auctions.find(a => a._id === auctionId)
		const previousBidder = users.find(u => u._id === auctionFromServer.highestBidderId)

		if (previousBidder) {
			const previousBidderToBeRepaid = {
				...previousBidder,
				wallet: previousBidder.wallet + auctionFromServer.lastBid
			}

			await service.updateUser(previousBidderToBeRepaid)

			dispatch(usersActions.updateUser(previousBidderToBeRepaid))
		}

		const auctionToBeUpdated = {
			...auctionFromServer,
			price: nextPrice,
			expirationTime: updateExpirationTime(auctionFromServer.expirationTime),
			highestBidderId: user._id,
			previousBidderId: auctionFromServer.highestBidderId || "",
			lastBid: auctionFromServer.price,
		}

		function updateBidAuctions() {
			if (user.bidAuctions.includes(auctionId)) {
				return user.bidAuctions
			} else {
				return [...user.bidAuctions, auctionId]
			}
		}

		const highestBidderToBeUpdated = {
			...user,
			wallet: user.wallet - Math.ceil(price),
			bidAuctions: updateBidAuctions()
		}

		await service.updateAuction(auctionId, auctionToBeUpdated)
		await service.updateUser(highestBidderToBeUpdated)

		dispatch(userActions.setUser(highestBidderToBeUpdated))
		dispatch(usersActions.updateUser(highestBidderToBeUpdated))
		dispatch(auctionsActions.updateAuction(auctionToBeUpdated))
	}

	async function handleCancel(auctionId) {
		const auction = auctions.find(a => a._id === auctionId)

		if (auction) {
			const highestBidder = users.find(u => u._id === auction.highestBidderId)

			if (highestBidder) {
				const highestBidderToBeRepaid = {
					...highestBidder,
					wallet: highestBidder.wallet + auction.price
				}

				await service.updateUser(highestBidderToBeRepaid)

				if (user._id === highestBidderToBeRepaid._id) {
					dispatch(userActions.setUser(highestBidderToBeRepaid))
				}

				dispatch(usersActions.updateUser(highestBidderToBeRepaid))
			}

			await service.deleteAuction(auctionId)

			dispatch(auctionsActions.deleteAuction(auctionId))
		}
	}

	return (
		<section>
			<input type="text" className="searchBar" />

			<header>
				<button onClick={() => handleSorting("name")}
					className={activeButton === "name" ? "active" : ""}
				> Name </button>

				<button onClick={() => handleSorting("duration")}
					className={activeButton === "duration" ? "active" : ""}
				> Duration </button>

				<button onClick={() => handleSorting("price")}
					className={activeButton === "price" ? "active" : ""}
				> Price </button>

				<button onClick={() => handleSorting("action")}
					className={activeButton === "action" ? "active" : ""}
				> Action </button>
			</header>

			{auctions.map(a => (
				<div className="auctionCard" key={a._id}>
					<div className="cardInfo">
						<p className="auctionName">{a.name}</p>

						<p className="auctionDuration">
							{formatTime(a.expirationTime - Date.now()).clock}
						</p>

						<p className="auctionPrice">
							{a.ownerId === user._id ? a.lastBid || a.price : a.price}
						</p>
					</div>

					{renderBidButton(a)}

					{user._id === a.ownerId && <button className="cardButton"
						onClick={() => handleCancel(a._id)}
					> Cancel </button>}
				</div>
			))}
		</section>
	)
}