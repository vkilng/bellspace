require('dotenv').config();
const validator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');

const Users = require('../models/User');
const Federated_Credentials = require('../models/Federated_Credential');
const signupController = require('./signupController');

exports.login_with_local = [
    validator.body('username', 'Letters, numbers, dashes, and underscores only. Please try again without symbols. Username must be between 3 and 20 characters.')
        .trim()
        .isLength({ min: 3, max: 20 })
        .escape(),
    validator.body('password', 'Password must be at least 8 characters long')
        .trim()
        .isLength({ min: 8 }),

    (req, res, next) => {
        passport.authenticate('local', {
            failureFlash: true,
            failureMessage: true,
            failureRedirect: 'http://localhost:8080/',
            successReturnToOrRedirect: 'http://localhost:8080/'
        })(req, res, next);
    },
];

passport.use(
    new LocalStrategy(async function verify(username, password, done) {
        try {
            const existingUser = await Users.findOne({ username: username });
            if (!existingUser) {
                return done(null, false, { message: "Incorrect username" });
            };
            bcrypt.compare(password, existingUser.password, (err, res) => {
                if (err) done(err);
                if (res) {
                    done(null, existingUser);
                } else {
                    done(null, false, { message: "Incorrect password" });
                }
            })
        } catch (err) {
            return done(err);
        };
    })
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/login/oauth2/redirect/google"
},
    async function verify(accessToken, refreshToken, profile, done) {
        try {
            const requiredCreds = await Federated_Credentials.findOne({
                provider: 'https://accounts.google.com',
                subject: profile.id
            }).exec();
            if (!requiredCreds) {
                try {
                    const new_username = await signupController.getNewUsername();
                    const user_instance = new Users({
                        cred_name: profile.displayName,
                        username: new_username,
                        email: profile.emails[0].value,
                    });
                    try {
                        await user_instance.save();
                        try {
                            await Federated_Credentials.create({
                                user_id: user_instance._id,
                                provider: 'https://accounts.google.com',
                                subject: profile.id
                            });
                            return done(null, user_instance);
                        } catch (error) {
                            return done(error);
                        }
                    } catch (error) {
                        return done(error);
                    }
                } catch (error) {
                    return done(error);
                }
            } else {
                try {
                    const existingUser = await Users.findById(requiredCreds.user_id).exec();
                    if (!existingUser) {
                        return done(null, false);
                    }
                    return done(null, existingUser);
                } catch (error) {
                    return done(error);
                }
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, user);
    });
});

passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, user);
    });
});