import { DiscordSDK } from '@discord/embedded-app-sdk';
import './style.css';

// Will eventually store the authenticated user's access_token
let auth;

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(() => console.log('Discord SDK is authenticated'));

async function setupDiscordSdk() {
	await discordSdk.ready();

	document.querySelector('#app').innerHTML = `
		<img id="screenshot" />
	`;

	const click = async (e, button) =>
		await fetch(
			'/api/click?x=' +
				e.offsetX / e.target.offsetWidth +
				'&y=' +
				e.offsetY / e.target.offsetHeight +
				'&btn=' +
				button,
		);
	document.querySelector('#screenshot').addEventListener('click', (e) => click(e, 'LEFT'));
	document.querySelector('#screenshot').addEventListener('contextmenu', (e) => click(e, 'RIGHT'));

	setInterval(async () => {
		const response = await fetch('/api/img');

		document.querySelector('#screenshot').src = await response.text();
	}, 200);
}

document.querySelector('#app').innerHTML = `
	Please wait a second while we get you ready.
`;
