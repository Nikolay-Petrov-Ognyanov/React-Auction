import "./App.css"
import { Routes, Route } from "react-router-dom"
import { Auth } from "./views/Auth"
import { Auction } from "./views/Auction"
import { Nav } from "./views/Nav"
import { Guard } from "./Guard"
import { Create } from "./views/Create"
import { Profile } from "./views/Profile"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import * as userActions from "./features/user"

export default function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		if (localStorage.getItem("accessToken")) {
			const { _id, accessToken, username, wallet } = localStorage

			dispatch(userActions.setUser({ _id, accessToken, username, wallet }))
		}
	}, [dispatch])

	return <div className="App">
		<Nav />

		<Routes>
			<Route path="/auth" element={<Auth />} />

			<Route element={<Guard />}>
				<Route path="/" element={<Auction />} />
				<Route path="/create" element={<Create />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="*" element={<Auction />} />
			</Route>
		</Routes>
	</div >
}