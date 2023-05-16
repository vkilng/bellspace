var router = require('express').Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.home_page_get);

router.use('/logout', indexController.logout_use);

module.exports = router;
