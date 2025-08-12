const express = require('express');
const router = express.Router();
const { protect } = require('@/middlewares/auth');
const aiAgentHandler = require('@/controllers/appControllers/aiagentController');

router.post('/add', protect, aiAgentHandler.addAgent);
router.get('/list', protect, aiAgentHandler.getAgents);
router.delete('/:id', protect, aiAgentHandler.deleteAgent);

module.exports = router;