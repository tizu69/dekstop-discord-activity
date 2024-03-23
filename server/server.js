import express from 'express';
import dotenv from 'dotenv';

import OBSWebSocket from 'obs-websocket-js';
import { mouse, straightTo, Button, Point } from '@nut-tree/nut-js';

dotenv.config({ path: '../.env' });

const obs = new OBSWebSocket();
const app = express();
const port = 3001;

let screenshot = '';
setInterval(
	async () =>
		(screenshot = (
			await obs.call('GetSourceScreenshot', {
				imageFormat: 'jpeg',
				imageCompressionQuality: 50,
				sourceName: '_dekstop',
			})
		).imageData),
	200,
);

const scale = process.env.FHD_SCALE || 1;

app.get('/api/img', async (_, res) => res.send(screenshot));
app.get('/api/click', async (req, res) => {
	const { x, y, btn } = req.query;

	await mouse.setPosition(new Point(x * 1920 * scale, y * 1080 * scale));
	await mouse.click(Button[btn]);
});

obs.connect('ws://192.168.2.108:4455', process.env.OBS);
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
