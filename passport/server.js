require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { PORT, MONGO_URI } = process.env;
const app = express();
const cookieParser = require('cookie-parser');
//Passport 등록
const passport = require('passport');
require('./config/passport');

mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.log(err));

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authRouter = require('./router/authRouter');
app.use('/auth', authRouter);

app.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
	try {
		res.render('index');
	} catch (error) {
		next(error);
	}
});

app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});
