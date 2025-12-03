const express = require('express');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort({ createdAt: -1 }).limit(6);
  res.render('index', { title: 'Home', movies });
});

module.exports = router;
