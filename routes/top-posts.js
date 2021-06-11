const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getComments } = require('../shared/comments');

router.get('/', async function (req, res) {
	let comments = await getComments();
	let posts = await getPosts();

	let aggregated = aggregate(comments, 'postId');
	let postsWithCommentCount = getPostsWithCommentCount(posts, aggregated);

	let topPosts = getTopPosts(postsWithCommentCount);

	if (topPosts) {
		res.status(200).send(topPosts);
		return;
	}
	res.status(500).send();
});

// getPosts return posts
async function getPosts() {
	const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
	return res.data;
}

// aggregate the data based on group
function aggregate(data, group) {
	let aggregated = new Map();

	if (!Array.isArray(data)) {
		return aggregated;
	}
	if (!data || !group) {
		return aggregated;
	}
	for (let d of data) {
		if (!(group in d)) {
			return aggregated;
		}
	}

	for (const d of data) {
		if (!aggregated.has(d[group])) {
			aggregated.set(d[group], 1);
			continue;
		}
		aggregated.set(d[group], aggregated.get(d[group]) + 1);
	}

	return aggregated;
}

// getPostsWithCommentCount return posts with comment count information
function getPostsWithCommentCount(posts, aggregated) {
	if (!Array.isArray(posts)) {
		return [];
	}

	let newPosts = [];
	for (let post of posts) {
		newPosts.push({
			post_id: post.id,
			post_title: post.title,
			post_body: post.body,
			total_number_of_comments: aggregated.get(post.id),
		});
	}

	return newPosts;
}

// getTopPosts return top posts based on its comment count
function getTopPosts(postsWithCommentCount) {
	if (!Array.isArray(postsWithCommentCount)) {
		return [];
	}

	for (let p of postsWithCommentCount) {
		if (!('total_number_of_comments' in p)) {
			return [];
		}
	}

	return postsWithCommentCount.sort((a, b) => {
		return b.total_number_of_comments - a.total_number_of_comments
	});
}

module.exports = {
	router,
	aggregate,
	getTopPosts,
};
