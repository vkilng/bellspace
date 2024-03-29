require('dotenv').config();
const asyncHandler = require("express-async-handler");
const validator = require('express-validator');
const validationResult = validator.validationResult;
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const sharp = require('sharp');
const Communities = require('../models/Community');
const Posts = require('../models/Post');
const Users = require('../models/User');

// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY
//     },
//     region: process.env.REGION_NAME
// });

const getRandomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

exports.create_community_post = [
    validator.body("community-name", "Invalid community name")
        .trim()
        .isLength({ min: 3, max: 21 })
        .custom(async (value) => {
            if (value.match(/[^a-zA-Z_]/g)) {
                throw new Error('Invalid community name');
            }
        }),
    validator.body("community-description", "Invalid community description")
        .trim()
        .isLength({ min: 8 }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            if (req.user) {
                const randomImageName = getRandomImageName();
                await sharp(req.file.buffer).resize({ width: 48, height: 48, fit: 'fill' }).toFile(`uploads/${randomImageName}.png`)
                // const command = new PutObjectCommand({
                //     Bucket: process.env.BUCKET_NAME,
                //     Key: getRandomImageName(),
                //     Body: modifiedImageBuffer,
                //     ContentType: req.file.mimetype
                // });
                // await s3.send(command);
                const newCommunity = new Communities({
                    name: req.body['community-name'],
                    description: req.body['community-description'],
                    profilepic: randomImageName,
                });
                const currentUser = await Users.findOne({ username: req.user.username }).exec();
                currentUser.communities.push(newCommunity._id);
                newCommunity.moderators.push(currentUser._id);
                await Promise.all([newCommunity.save(), currentUser.save()]);
                req.logIn(currentUser, function (err) {
                    if (!err) {
                        console.log('--> Successfully updated user');
                        res.redirect(`/r/${req.body['community-name']}`);
                    }
                });
            }
        } else {
            req.flash("error", errors.mapped()['community-name'].msg);
            res.redirect('/');
        }
    }),
];

exports.join_community_post = asyncHandler(async (req, res, next) => {
    const community = await Communities.findOne({ name: req.params.community_name }).exec();
    const currentUser = await Users.findOne({ username: req.user.username }).exec();
    if (!currentUser.communities.includes(community._id)) {
        currentUser.communities.push(community._id);
        community.memberCount += 1;
        await Promise.all([community.save(), currentUser.save()]);
        req.logIn(currentUser, function (err) {
            if (!err) {
                console.log('--> Successfully updated user');
                res.redirect(`/r/${req.params.community_name}`);
            }
        });
    } else {
        res.redirect('/');
    }
})

exports.leave_community_post = asyncHandler(async (req, res, next) => {
    const community = await Communities.findOne({ name: req.params.community_name }).exec();
    const currentUser = await Users.findOne({ username: req.user.username }).exec();
    const indexOfCommunity = currentUser.communities.indexOf(community._id);
    if (indexOfCommunity > -1) {
        currentUser.communities.splice(indexOfCommunity, 1);
        community.memberCount -= 1;
        const indexOfUser = community.moderators.indexOf(currentUser._id);
        if (indexOfUser > -1) {
            community.moderators.splice(indexOfUser, 1);
        }
        await Promise.all([community.save(), currentUser.save()]);
        req.logIn(currentUser, function (err) {
            if (!err) {
                console.log('--> Successfully updated user');
                res.redirect(`/r/${req.params.community_name}`);
            }
        });
    } else {
        res.redirect('/');
    }
});

exports.community_overview_get = asyncHandler(async (req, res, next) => {
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    const community = await Communities.findOne({ name: req.params.community_name }).exec();
    if (community) {
        const communityPosts = await Posts.find({ community: community._id }).exec();
        res.render('community-overview', { currentUser: req.user, communitiesList, community, communityPosts });
    } else {
        res.render('community-overview', { currentUser: req.user, communitiesList, community: null });
    }
});

exports.create_post_get = asyncHandler(async (req, res, next) => {
    const communitiesList = await Communities.find().sort({ created_at: -1 }).select('name').exec();
    const community = await Communities.findOne({ name: req.params.community_name }).populate('memberCount').exec();
    if (req.user && community) {
        res.render('create-post', { currentUser: req.user, communitiesList, community });
    } else {
        res.redirect('/');
    }
})

exports.create_post_post = asyncHandler(async (req, res, next) => {
    res.send('Yeah, wait a minute');
})