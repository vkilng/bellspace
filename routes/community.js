const router = require('express').Router();
const communityController = require('../controllers/communityController');
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.post('/create-community', upload.single('community-profilepic'), communityController.create_community_post);

router.post('/:community_name/join', communityController.join_community_post);

router.post('/:community_name/leave', communityController.leave_community_post);

router.get('/:community_name', communityController.community_overview_get);

router.get('/:community_name/submit', communityController.create_post_get);

router.post('/:community_name/submit', communityController.create_post_post);

module.exports = router;