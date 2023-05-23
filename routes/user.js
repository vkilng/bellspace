var router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/:username', userController.user_overview_get);

router.get('/:username/submit', userController.create_post_get);

router.post('/:username/submit', userController.create_post_post);

router.get('/:username/posts', userController.user_allposts_get);

router.get('/:post_author/comments/:post_id', userController.user_post_get);

module.exports = router;