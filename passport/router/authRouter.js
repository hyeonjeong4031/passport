const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const User = require('../models/user');

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/signup', (req, res) => {
	res.render('signup');
});

// POST
router.post('/login', (req, res) => {
	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: 'Something is not right',
			});
		}

		req.login(user, { session: false }, (err) => {
			if (err) {
				console.log("Error AuthRouter: ", err);
                res.json({ message: err });
			}

			// jwt 만드는 과정
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
			return res.json({ user, token });
		});
	})(req, res);
});

router.post('/signup', (req, res) => {
	User.create(
		{
			username: req.body.username,
			password: req.body.password,
		},
		(err, user) => {
			if (err) {
				res.status(500).json({
					message: 'Internal Server Error',
					err,
				});
			} else {
				res.status(200);
			}
		}
	);
});

module.exports = router;
