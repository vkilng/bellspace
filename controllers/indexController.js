const asyncHandler = require('express-async-handler');
const Posts = require('../models/Post');

exports.home_page_get = asyncHandler(async (req, res, next) => {
    const posts = await Posts.find().populate('author').exec();
    res.render('index', { posts, currentUser: req.user, error: req.flash("error")[0] });
});

exports.logout_use = asyncHandler(function (req, res, next) {
    req.logout(function (err) {
        if (err) next(err);
        else res.redirect('/');
    })
});