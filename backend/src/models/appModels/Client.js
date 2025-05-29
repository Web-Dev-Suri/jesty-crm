const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  name: {
    type: String,
    required: true,
  },
  phone: String,
  country: String,
  address: String,
  email: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  status: {
  type: String,
  enum: [
    'New Lead',
    'Contacted',
    'Did not pick',
    'Consultation Scheduled',
    'DND',
  ],
  default: 'New Lead',
},
source: {
  type: String,
  enum: ['Website', 'Google Form', 'Meta Campaign A', 'Meta Campaign B'],
}, 
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
