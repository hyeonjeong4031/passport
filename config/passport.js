const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = require('passport-jwt').Strategy;

//로컬 전략
passport.use(
	new LocalStrategy((username, password, done) => {
		return User.findOne({ username: username })
			.then((user) => {
				if (!user || !password) {
					// done = 내보낼 결과
					return done(null, false, {
						message: 'Incorrect username or password',
					});
				}

				// 유저가 있다는 소리
				return done(null, user, { message: 'Logged In Successfully' });
			})
			.catch((err) => done(err));
	})
);

// 쿠키를 빼오는(?) 함수
let cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['token'];
		console.log('Token: ', token);
		return token;
	}
};

// JWT 전략
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_SECRET,
		},
		async function (jwtPayload, done) {
			console.log('test');
			try {
				// payload id 값으로 유저의 데이터를 조회
				console.log('jwt: ', jwtPayload);
				const user = await User.findOne({ where: { id: jwtPayload.id } });
				if (user) {
					console.log('User: ', user);
					done(null, user);
					return;
				}

				done(null, false, { message: '올바르지 않은 인증정보입니다.' });
			} catch (error) {
				console.log('Error: ', error);
				done(error);
			}
		}
	)
);
