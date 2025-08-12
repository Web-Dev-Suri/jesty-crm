const mongoose = require('mongoose');

const AiAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  voiceId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Aiagent', AiAgentSchema);