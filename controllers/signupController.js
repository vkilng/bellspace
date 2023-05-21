const validator = require('express-validator');
const validationResult = validator.validationResult;
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const { uniqueNamesGenerator, adjectives, colors, animals, NumberDictionary } = require('unique-names-generator');
const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });

const Users = require('../models/User');

exports.signup_get = asyncHandler((req, res, next) => {
    res.render('signup', { newUser: null, errors: null });
})

exports.signup_post = [
    validator.body('email', 'Must be a valid email address').trim().isEmail().escape(),
    validator.body('username', 'Letters, numbers, dashes, and underscores only. Please try again without symbols. Username must be between 3 and 20 characters.')
        .trim().isLength({ min: 3, max: 20 })
        .custom(async value => {
            if (await usernameExists(value)) {
                throw new Error('Username not available, try a different one');
            }
            if (value.match(/[^0-9a-zA-Z-_]/g)) {
                throw new Error('Letters, numbers, dashes, and underscores only. Please try again without symbols. Username must be between 3 and 20 characters.');
            }
        }),
    validator.body('password', 'Password must be at least 8 characters long')
        .trim()
        .isLength({ min: 8 }),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const newUser = new Users({
            username: req.body.username,
            email: req.body.email,
        });

        if (errors.isEmpty()) {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    next(err);
                } else {
                    newUser.password = hashedPassword;
                    await newUser.save();
                    res.redirect('/');
                }
            })
        } else {
            res.render('signup', { layout: false, newUser, errors: errors.mapped() });
        }
    }),
];

exports.getNewUsername = async () => {
    const newUsername = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, numberDictionary],
        length: 3,
        separator: '-',
    });
    if (await usernameExists(newUsername)) {
        return await getNewUsername();
    } else {
        return newUsername;
    }
}

const usernameExists = async (input_username) => {
    const usernameQueryResult = await Users.find({ username: input_username }).exec();
    if (usernameQueryResult.length < 1) {
        return false;
    }
    return true;
}