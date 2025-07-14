const express = require('express');
const router = express.Router();
const controller = require('@/controllers/appControllers/formResponseController');

// Create a new form response
router.post('/', controller.create);

// Get all form responses for a client
router.get('/client/:clientId', controller.listByClient);

// Get a single form response by ID
router.get('/:id', controller.read);

module.exports = router;