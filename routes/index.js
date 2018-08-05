const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post('get-movie', async (req, res) => {
	try {
		const { id } = req.body
		const movie = await axios({
			method: 'GET',
			url: `https://api.themoviedb.org/3/movie/${id}`,
			params: {
				api_key: '2d1610b0077610c43b2fe59ad827cfec'
			}
		})
		res.send(movie)
	} catch (err) {
		console.log(err)
	}
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