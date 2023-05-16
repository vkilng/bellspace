const router = require('express').Router();

const signupController = require('../controllers/signupController');


router.get('/', signupController.signup_get);

router.post('/', signupController.signup_post);

module.exports = router;