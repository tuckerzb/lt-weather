import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Footer from './footer';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import About from '../routes/about';
import Contact from '../routes/contact';
import Tools from '../routes/tools'
import Suggest from '../routes/suggest';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" exact />
			<About path="/about" />
			<Contact path="/contact" />
			<Tools path='/tools' />
			<Suggest path='/suggest' />
		</Router>
		<Footer />
	</div>
)

export default App;
