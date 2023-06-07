import './App.css';
import { Routes, Route } from "react-router-dom"
import { ContextProvider } from './Context';
import Auth from './views/Auth';
import Home from './views/Home';
import Nav from './views/Nav';

export default function App() {
	return (<div className="App">
		<ContextProvider>
			<Nav />

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/auth' element={<Auth />} />

				<Route path='*' element={<Home />} />
			</Routes>
		</ContextProvider>
	</div>);
}