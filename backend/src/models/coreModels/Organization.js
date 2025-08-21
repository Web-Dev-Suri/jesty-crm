const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: { type: String, required: true },
  created: { type: Date, default: Date.now },
  organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
});

module.exports = mongoose.model('Organization', organizationSchema);