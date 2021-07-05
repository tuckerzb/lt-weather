import { h } from 'preact';
import { Link } from 'preact-router';
import style from './style.css';

const About = () => (
	<div class={style.container}>
		<div class={style.headerBlock}>
			<h1>About</h1>
			<p>This project was inspired by <a href='https://www.atweather.org/' target='_blank' rel="noopener noreferrer">ATWeather.org</a> - an incredible resource for the AT and PCT hiking communities developed by Pat Jones.</p>
			<p>CDT Weather is created and maintained by <a href='https://zachtucker.dev' target='_blank' rel="noopener noreferrer">Zach "Free Fall" Tucker</a> (Tahoe Rim Trail 2019, AT NOBO 2020). Please use the <Link href='/contact'>Contact</Link> page for comments, suggestions, and concerns.</p>
			<h2>Support</h2>
			<p>If you find CDT Weather useful, please consider supporting the project. There a number of ways to help, like telling
				your friends about this website, suggesting important landmarks (see the homepage for a link), or donating to cover the cost of hosting ($7/month).
			</p>
			<p>
				Monetary donations can be sent via PayPal at the following link: <a href='https://www.paypal.com/paypalme/ZacharyTucker928' target='_blank' rel="noopener noreferrer">https://www.paypal.com/paypalme/ZacharyTucker928</a> and are greatly appreciated! Thank you to these hikers for their support:
			</p>
			<ul>
				<li>Ahjah "Roger That" Boise (April 2021)</li>
			</ul>

		</div>
	</div>
);

export default About;
