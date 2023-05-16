const validator = require('express-validator');
const validationResult = validator.validationResult;
const asyncHandler = require("express-async-handler");

const Users = require('../models/User');
const Posts = require('../models/Post');

exports.create_post_get = asyncHandler(async (req, res, next) => {
    if (req.user && req.params.username === req.user.username) {
        res.render('create-post', { requestedUser: null, currentUser: req.user, error: req.flash("error")[0] });
    } else {
        res.redirect('/');
    }
});

exports.create_post_post = [
    validator.body("post-title", "Invalid title")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    validator.body("post-content", "invalid post content")
        .trim()
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const new_post = new Posts({
            title: req.body['post-title'],
            body: req.body['post-content'],
            author: req.user._id,
        });
        if (errors.isEmpty()) {
            await new_post.save();
            res.redirect('/');
        } else {
            res.redirect(`/user/${req.user.username}/submit`);
        }
    }),
];

exports.user_overview_get = asyncHandler(async (req, res, next) => {
    const requestedUser = await Users.findOne({ username: req.params.username }).exec();
    res.render('user-overview', { requestedUser, currentUser: req.user, error: req.flash("error")[0] });
});

exports.user_posts_get = asyncHandler(async (req, res, next) => {
    const requestedUser = await Users.find({ username: req.params.username }).exec();
    const requestedUserPosts = await Posts.find({ username: requestedUser._id }).populate('author').exec();
    res.render('user-posts', {
        requestedUser,
        currentUser: req.user,
        requestedUserPosts,
        error: req.flash("error")[0]
    })
});

// exports.user_comments_get

// exports.user_saved_get

// exports.user_upvoted_get

// exports.user_downvoted_get