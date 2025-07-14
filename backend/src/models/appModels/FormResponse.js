const mongoose = require('mongoose');

const FormResponseSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  formId: { type: String }, // or ObjectId if you have a forms collection
  submittedAt: { type: Date, default: Date.now },
  responses: { type: Object, default: {} } // dynamic fields
});

module.exports = mongoose.model('FormResponse', FormResponseSchema);