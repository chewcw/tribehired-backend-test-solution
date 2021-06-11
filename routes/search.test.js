const { expect } = require('chai');
const { filter } = require('./search');

let mockedData = [
	{
		postId: 1,
		id: 1,
		name: 'test1',
	},
	{
		postId: 1,
		id: 2,
		name: 'test2',
	},
	{
		postId: 2,
		id: 3,
		name: 'Test1@email.com',
	},
	{
		postId: 4,
		id: 4,
		name: 'test3',
	},
	{
		postId: 2,
		id: 5,
		name: 'test5@email.com',
	},
];

describe('Filter function', () => {
	it('should return empty array if wrong args being input', () => {
		expect(filter()).to.be.empty;
		expect(filter(mockedData)).to.be.empty;
		expect(filter([])).to.be.empty;
		expect(filter(mockedData, '')).to.be.empty;
	});

	it('should only search for available fields', () => {
		expect(filter(mockedData, { postId: 1, random: 2 })).to.be.empty;
		expect(filter(mockedData, { postId: 1 })).to.eql([
			{
				postId: 1,
				id: 1,
				name: 'test1',
			},
			{
				postId: 1,
				id: 2,
				name: 'test2',
			},
		]);
		expect(filter(mockedData, { postId: 1, id: 1 })).to.eql([
			{
				postId: 1,
				id: 1,
				name: 'test1',
			},
		]);
	});

	it('should be fuzzy search and case insensitive in terms of searching inside a string', () => {
		expect(filter(mockedData, { name: 'test1' })).to.be.eql([
			{
				postId: 1,
				id: 1,
				name: 'test1',
			},
			{
				postId: 2,
				id: 3,
				name: 'Test1@email.com',
			},
		]);
	});

	it('should be able to return number result even if string search term was being input', () => {
		expect(filter(mockedData, { id: '2' })).to.be.eql([
			{
				postId: 1,
				id: 2,
				name: 'test2',
			},
		]);
	});
})
