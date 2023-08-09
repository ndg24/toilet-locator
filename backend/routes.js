const express = require('express');
const router = express.Router();
const toiletController = require('./controllers/toiletController');

router.get('/nearby-toilets', toiletController.findNearbyToilets);

module.exports = router;