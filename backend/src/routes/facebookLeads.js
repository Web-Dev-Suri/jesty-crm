const express = require('express');
const router = express.Router();
const facebookLeadController = require('@/controllers/facebookleadController/facebookLeadController');

router.get('/facebook/auth', facebookLeadController.facebookAuth);
router.get('/facebook/callback', facebookLeadController.facebookCallback);
router.post('/facebook/webhook', express.json({ type: '*/*' }), facebookLeadController.facebookWebhook);
router.get('/facebook/webhook', facebookLeadController.facebookWebhook); // For verification

module.exports = router;