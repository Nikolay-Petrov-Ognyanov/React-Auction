import "./App.css"
import { Routes, Route } from "react-router-dom"
import { Auth } from "./views/Auth"
import { Home } from "./views/Home"
import { Nav } from "./views/Nav"
import { Guard } from "./Guard"
import { Create } from "./views/Create"

export default function App() {
	return (<div className="App">
		<Nav />

		<Routes>
			<Route path="/auth" element={<Auth />} />

			<Route element={<Guard />}>
				<Route path="/" element={<Home />} />
				<Route path="/create" element={<Create />} />
				<Route path="*" element={<Home />} />
			</Route>
		</Routes>
	</div >)
}