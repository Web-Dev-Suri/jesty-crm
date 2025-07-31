const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: { type: String, required: true },
  created: { type: Date, default: Date.now },
  // Add more fields as needed (address, contact info, etc.)
});

module.exports = mongoose.model('Organization', organizationSchema);

