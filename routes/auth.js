const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.get('/register', function (req, res) {
  res.render('auth/register', { title: 'Register', old: {}, errorsArray: [] });
});

router.post(
  '/register',
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').custom(function (value, { req }) {
      return value === req.body.password;
    })
  ],
  async function (req, res) {
    const errors = validationResult(req);
    const errorsArray = errors.array();
    if (errorsArray.length > 0) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        old: { name: req.body.name, email: req.body.email },
        errorsArray
      });
    }
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        old: { name: req.body.name, email: req.body.email },
        errorsArray: [{ msg: 'Email is already registered' }]
      });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    await user.save();
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    req.session.success = 'Registration successful';
    res.redirect('/');
  }
);

router.get('/login', function (req, res) {
  res.render('auth/login', { title: 'Login', old: {}, errorsArray: [] });
});

router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async function (req, res) {
    const errors = validationResult(req);
    const errorsArray = errors.array();
    if (errorsArray.length > 0) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        old: { email: req.body.email },
        errorsArray
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        old: { email: req.body.email },
        errorsArray: [{ msg: 'Invalid email or password' }]
      });
    }
    const match = await user.comparePassword(req.body.password);
    if (!match) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        old: { email: req.body.email },
        errorsArray: [{ msg: 'Invalid email or password' }]
      });
    }
    req.session.user = { id: user._id.toString(), name: user.name, email: user.email };
    req.session.success = 'Logged in successfully';
    res.redirect('/');
  }
);

router.post('/logout', function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
});

module.exports = router;
