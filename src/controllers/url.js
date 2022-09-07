const validUrl = require('valid-url');
const Url = require('../models/url');
const dotenv = require('dotenv');
const RandExp = require('randexp');

dotenv.config();
//Redirect  to long URL

const redirect = async (req, res, next) => {
	try {		
		const url = await Url.findOne({urlCode: req.params.code});
		if (url) {
			return res.redirect(url.longUrl);
		} else {
			return res.status(404).json('No URL Found');
		}
	} catch (err) {
		res.status(500).json('Server Error');
	}
};

//Create short URL

const shorten = async (req, res, next) => {
	const baseUrl = `${process.env.HOST}:${process.env.PORT}`;
	const { longUrl } = req.body;
	if (!validUrl.isUri(baseUrl)) {
		return res.status(401).json('Invalid base URL');
	}
	const urlCode =new RandExp(/^([A-Z]|[a-z]|[0-9]){6}$/).gen();
	if (validUrl.isUri(longUrl)) {
		try {
			let url = await Url.findOne({
				longUrl,
			});
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
			console.log(err);
			res.status(500).json('Server Error');
		}
	} else {
		res.status(401).json('Invalid longUrl');
	}
};

module.exports = {
	redirect,
	shorten,
};
