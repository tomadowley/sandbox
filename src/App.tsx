import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const App = () => {
	return (
		<BrowserRouter>
			<div className='App'>
				<nav>
					<h1>React Sandbox</h1>
					<Link to='/'>Home</Link>
					<Link to='/about'>About</Link>
					<Link to='/contact'>Contact</Link>
				</nav>
				<Routes>
					<Route
						path='/'
						element={
							<>
								<Home />
							</>
						}
					/>
					<Route path='/about' element={<About />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='*' element={<div>404 Not Found</div>} />
				</Routes>
			</div>
		</BrowserRouter>
	);
};
export default App;

const Home = () => (
	<div>
		<header className='App-header'>
			<img src={logo} className='App-logo' alt='logo' />
			<p>
				Edit <code>src/App.tsx</code> and save to reload.
			</p>
			<a
				className='App-link'
				href='https://reactjs.org'
				target='_blank'
				rel='noopener noreferrer'
			>
				Learn React
			</a>
		</header>
	</div>
);

const About = () => <div>About</div>;

const Contact = () => <div>Contact</div>;