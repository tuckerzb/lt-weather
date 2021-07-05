import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Footer = () => (
	<footer class={style.footer}>
        <div class={style.footerCopyright}>Copyright &copy;2021</div>
		<div class={style.footerContent}>Website by <a target='_blank' rel="noopener noreferrer" href='https://zachtucker.dev'>Zach "Free Fall" Tucker</a></div>
	</footer>
);

export default Footer;
