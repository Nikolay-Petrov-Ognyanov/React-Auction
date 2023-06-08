import './App.css';
import { Routes, Route } from "react-router-dom"
import { ContextProvider } from './Context';
import { Auth } from './views/Auth';
import { Home } from './views/Home';
import { Nav } from './views/Nav';
import { Guard } from './Guard';

export default function App() {
	return (<div className="App">
		<ContextProvider>
			<Nav />

			<Routes>
				<Route path='/auth' element={<Auth />} />

				<Route element={<Guard />}>
					<Route path='/' element={<Home />} />
					<Route path='*' element={<Home />} />
				</Route>
			</Routes>
		</ContextProvider>
	</div >);
}