const express = require('express')
const router = express.Router()
const axios = require('axios')
const redis = require('redis')
const client = redis.createClient()

router.post('get-movie', async (req, res) => {
	const { id } = req.body
	client.hgetall(id, (error, foundMovie) => {
		if (error) {
			return console.log(error)
		}
		if (foundMovie) {
			res.send(foundMovie)
		} else {
			const movie = await axios({
				method: 'GET',
				url: `https://api.themoviedb.org/3/movie/${id}`,
				params: {
					api_key: '2d1610b0077610c43b2fe59ad827cfec'
				}
			})
			const { backdrop_path, original_title, overview, poster_path, release_date, vote_average } = movie
			client.hset(id, [
				'backdrop_path', backdrop_path,
				'original_title', original_title,
				'overview', overview,
				'poster_path', poster_path,
				'release_date', release_date,
				'vote_average', vote_average
			], (error, reply) => {
				if (error) {
					console.log(error)
				}
				console.log(reply)
				res.send(movie)
			})
		}
	})
})

router.get('get-featured', async (req, res) => {
	try {
		const featuredMovies = await axios({
			method: 'GET',
			url: 'https://api.themoviedb.org/4/list/7',
			params: {
				page: 1,
				api_key: '2d1610b0077610c43b2fe59ad827cfec'
			}
		})
		res.send(featuredMovies)
	} catch (err) {
		console.log(err)
	}
})

router.post('get-genre', async (req, res) => {
	try {
		const { chosenGenre } = req.body
		const genreMovies = await axios({
			method: 'GET',
			url: 'https://api.themoviedb.org/3/discover/movie',
			params: {
				include_adult: 'false',
				language: 'en-US',
				api_key: '2d1610b0077610c43b2fe59ad827cfec',
				external_source: 'imdb_id',
				with_genres: chosenGenre,
				sort_by: 'popularity.desc',
				include_video: 'false'
			}
		})
		res.send(genreMovies)
	} catch (err) {
		console.log(err)
	}
})

module.exports = router