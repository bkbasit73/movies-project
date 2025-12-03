const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');

const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.session.errors = ['You must be logged in to perform this action'];
  res.redirect('/login');
}

async function ensureOwner(req, res, next) {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    req.session.errors = ['Movie not found'];
    return res.redirect('/movies');
  }

  if (movie.owner.toString() !== req.session.user.id) {
    return res.status(403).render('403', { title: 'Access Forbidden' });
  }

  req.movie = movie;
  next();
}

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.render('movies/list', { title: 'Movies', movies });
});

router.get('/new', ensureAuth, function (req, res) {
  res.render('movies/form', { title: 'Add Movie', old: {}, errorsArray: [] });
});

router.post(
  '/',
  ensureAuth,
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('year').isInt({ min: 1888 }),
    body('genres').trim().notEmpty(),
    body('rating').isFloat({ min: 0, max: 10 }),
    body('posterUrl').optional({ checkFalsy: true }).isURL()
  ],
  async function (req, res) {
    const errors = validationResult(req);
    const errorsArray = errors.array();
    const genresArray = req.body.genres.split(',').map(function (g) {
      return g.trim();
    });

    if (errorsArray.length > 0) {
      return res.render('movies/form', {
        title: 'Add Movie',
        old: req.body,
        errorsArray
      });
    }

    const movie = new Movie({
      name: req.body.name,
      description: req.body.description,
      year: req.body.year,
      genres: genresArray,
      rating: req.body.rating,
      posterUrl: req.body.posterUrl,
      owner: req.session.user.id
    });

    await movie.save();
    req.session.success = 'Movie added successfully';
    res.redirect('/movies');
  }
);

router.get('/:id', async function (req, res) {
  const movie = await Movie.findById(req.params.id).populate('owner');

  if (!movie) {
    req.session.errors = ['Movie not found'];
    return res.redirect('/movies');
  }

  const isOwner =
    req.session.user && movie.owner._id.toString() === req.session.user.id;

  res.render('movies/detail', { title: movie.name, movie, isOwner });
});

router.get('/:id/edit', ensureAuth, ensureOwner, function (req, res) {
  const movie = req.movie;

  res.render('movies/edit', {
    title: 'Edit Movie',
    movie,
    old: {
      name: movie.name,
      description: movie.description,
      year: movie.year,
      genres: movie.genres.join(', '),
      rating: movie.rating,
      posterUrl: movie.posterUrl
    },
    errorsArray: []
  });
});

router.post(
  '/:id/edit',
  ensureAuth,
  ensureOwner,
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('year').isInt({ min: 1888 }),
    body('genres').trim().notEmpty(),
    body('rating').isFloat({ min: 0, max: 10 }),
    body('posterUrl').optional({ checkFalsy: true }).isURL()
  ],
  async function (req, res) {
    const errors = validationResult(req);
    const errorsArray = errors.array();
    const movie = req.movie;
    const genresArray = req.body.genres.split(',').map(function (g) {
      return g.trim();
    });

    if (errorsArray.length > 0) {
      return res.render('movies/edit', {
        title: 'Edit Movie',
        movie,
        old: req.body,
        errorsArray
      });
    }

    movie.name = req.body.name;
    movie.description = req.body.description;
    movie.year = req.body.year;
    movie.genres = genresArray;
    movie.rating = req.body.rating;
    movie.posterUrl = req.body.posterUrl;

    await movie.save();

    req.session.success = 'Movie updated successfully';
    res.redirect('/movies/' + movie._id);
  }
);

router.post('/:id/delete', ensureAuth, ensureOwner, async function (req, res) {
  await Movie.findByIdAndDelete(req.params.id);
  req.session.success = 'Movie deleted successfully';
  res.redirect('/movies');
});

module.exports = router;
