import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Footer from './footer';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import About from '../routes/about';
import Contact from '../routes/contact';
import Tools from '../routes/tools'

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" exact />
			<About path="/about" />
			<Contact path="/contact" />
			<Tools path='/tools' />
		</Router>
		<Footer />
	</div>
)

export default App;
