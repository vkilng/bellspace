const asyncHandler = require('express-async-handler');

const Posts = require('../models/Post');
const Communities = require('../models/Community');

exports.home_page_get = asyncHandler(async (req, res, next) => {
    const posts = await Posts.find().sort({ created_at: -1 }).populate('author').exec();
    const communitiesList = await Communities.find().select('name').exec();
    res.render('index', { communitiesList, posts, currentUser: req.user, errorMsg: req.flash("error")[0] });
});


exports.logout_use = asyncHandler(function (req, res, next) {
    req.logout(function (err) {
        if (err) next(err);
        else res.redirect('/');
    })
});