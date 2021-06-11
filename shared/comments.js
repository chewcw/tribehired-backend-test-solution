const axios = require('axios');

// getComments return comments
async function getComments() {
	const res = await axios.get('https://jsonplaceholder.typicode.com/comments');
	return res.data;
}

module.exports = {
	getComments,
}
