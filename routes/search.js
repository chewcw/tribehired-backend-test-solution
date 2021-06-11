var express = require('express');
var router = express.Router();
const { getComments } = require('../shared/comments');

router.get('/', async function (req, res) {
	let comments = await getComments();

	if (!req.query) {
		res.status(400).send('please input search term');
	}

	let filtered = filter(comments, req.query);
	if (filtered) {
		res.status(200).send(filtered);
		return;
	}
	res.status(500).send();
});

// filter try to filter out the data based on the search term
function filter(data, search) {
	if (!Array.isArray(data)) {
		return [];
	}
	if (!data || !search) {
		return [];
	}
	for (let searchTerm in search) {
		if (!(searchTerm in data[0])) {
			return [];
		}
	}

	try {
		let result = [];

		o:
		for (let d of data) {
			for (let searchTerm in search) {
				if (typeof d[searchTerm] === 'string') {
					if (d[searchTerm].toLowerCase().includes(search[searchTerm].toLowerCase())) {
						result.push(d);
						continue o;
					}
				}

				if (d[searchTerm] != search[searchTerm]) {
					continue o;
				}
			}
			result.push(d);
		}
		return result;
	} catch (error) {
		return [];
	}
}

module.exports = {
	router,
	filter,
};
