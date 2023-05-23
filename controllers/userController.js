const validator = require('express-validator');
const validationResult = validator.validationResult;
const asyncHandler = require("express-async-handler");

const Users = require('../models/User');
const Posts = require('../models/Post');
const Communities = require('../models/Community');

exports.create_post_get = asyncHandler(async (req, res, next) => {
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    if (req.user && req.params.username === req.user.username) {
        res.render('create-post', { communitiesList, requestedUser: null, currentUser: req.user, errorMsg: req.flash("error")[0] });
    } else {
        res.redirect('/');
    }
});

exports.create_post_post = [
    validator.body("post-title", "Invalid title")
        .trim()
        .isLength({ min: 1 }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const new_post = new Posts({
            title: req.body['post-title'],
            body: req.body['post-body-content'],
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
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    const requestedUser = await Users.findOne({ username: req.params.username }).exec();
    res.render('user-overview', { tab: 'overview', requestedUser, currentUser: req.user, errorMsg: req.flash("error")[0], communitiesList });
});

exports.user_allposts_get = asyncHandler(async (req, res, next) => {
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    const requestedUser = await Users.findOne({ username: req.params.username }).exec();
    const requestedUserPosts = await Posts.find({ author: requestedUser._id }).sort({ created_at: -1 }).populate('author').exec();
    res.render('user-posts', {
        tab: 'posts',
        requestedUser,
        currentUser: req.user,
        requestedUserPosts,
        errorMsg: req.flash("error")[0],
        communitiesList,
    })
});

// exports.user_comments_get

// exports.user_saved_get

// exports.user_upvoted_get

// exports.user_downvoted_get

exports.user_post_get = asyncHandler(async (req, res, next) => {
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    const requestedUser = await Users.findOne({ username: req.params.post_author }).exec();
    const post = await Posts.findOne({ _id: req.params.post_id }).populate('author').populate('community').exec();
    res.render('post-page', {
        currentUser: req.user,
        communitiesList,
        requestedUser,
        post,
    });
});