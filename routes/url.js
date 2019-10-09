const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');

// @route POST /api/url/shorten
// @des Create short URL
router.post('/shorten', async (req, res) => {
	const { longUrl } = req.body;
	const baseUrl = config.get('baseUrl');

	if (!validUrl.isUri(baseUrl)) {
		return res.status(401).json('Invalid base url');
	}

	const urlCode = shortid.generate();

	if (validUrl.isUri(longUrl)) {
		try {
			let url = await Url.findOne({ longUrl });
			if (url) {
				res.json(url);
			} else {
				const shortUrl = baseUrl + '/' + urlCode;

				url = new Url({
					longUrl,
					shortUrl,
					urlCode,
					date: new Date(),
				});

				await url.save();

				res.json(url);
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).json('Server error');
		}
	} else {
		res.status(401).json('Invaild initial url');
	}
});

module.exports = router;
