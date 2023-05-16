var router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/:username', userController.user_overview_get);

router.get('/:username/posts', userController.user_posts_get);

router.get('/:username/submit', userController.create_post_get);

router.post('/:username/submit', userController.create_post_post);

module.exports = router;