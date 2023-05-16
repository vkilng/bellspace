var router = require('express').Router();
var passport = require('passport');

const loginController = require('../controllers/loginController');

router.post('/auth/local', loginController.login_with_local);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/'
}))

module.exports = router;