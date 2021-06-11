const { expect } = require('chai');
const { aggregate, getTopPosts } = require('./top-posts');

let mockedData = [
	{
		id: 1,
	},
	{
		id: 2,
	},
	{
		id: 1,
	},
	{
		id: 3,
	},
	{
		id: 3,
	},
];

describe('Aggregate function', () => {
	it('should return empty Map if wrong or empty args provided', () => {
		expect(aggregate()).to.be.empty;
		expect(aggregate('test', 'test')).to.be.empty;
		expect(aggregate(mockedData, 'idx')).to.be.empty;
		expect(aggregate([], 'id')).to.be.empty;
		expect(aggregate(mockedData, '')).to.be.empty;
	})

	it('should aggregate the count based on given arg', () => {
		expect(aggregate(mockedData, 'id')).to.have.all.keys(1, 2, 3);
		expect(aggregate(mockedData, 'id').get(1)).to.equal(2);
		expect(aggregate(mockedData, 'id').get(2)).to.equal(1);
		expect(aggregate(mockedData, 'id').get(3)).to.equal(2);
	})
})

let mockedData2 = [
	{ id: 1, total_number_of_comments: 12 },
	{ id: 2, total_number_of_comments: 1 },
	{ id: 3, total_number_of_comments: 12 },
];

describe('Get top posts function', () => {
	it('should return empty array if input arg provided is incorrect', () => {
		expect(getTopPosts()).to.be.empty;
		expect(getTopPosts([{id: 1}])).to.be.empty;
		expect(getTopPosts([{id: 1, commentCount: 2}])).to.be.empty;
	});

	it('should return posts sorted by comment count', () => {
		expect(getTopPosts(mockedData2)).to.eql([
			{ id: 1, total_number_of_comments: 12 },
			{ id: 3, total_number_of_comments: 12 },
			{ id: 2, total_number_of_comments: 1 },
		]);
	})
})
