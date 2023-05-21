const router = require('express').Router();
const communityController = require('../controllers/communityController');
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
router.post('/create-community', upload.single('community-profilepic'), communityController.create_community_post);

router.get('/:community_name', communityController.community_overview_get);

module.exports = router;