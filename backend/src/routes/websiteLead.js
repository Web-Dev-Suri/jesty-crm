const express = require('express');
const router = express.Router();
const cors = require('cors');
const { receiveWebsiteLead } = require('@/controllers/websiteleadController/websiteLeadController');

router.post('/leads/website', receiveWebsiteLead);

module.exports = router;