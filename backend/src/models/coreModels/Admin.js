const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true },
  surname: { type: String },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'user'],
  },
  facebookIntegration: {
    connected: { type: Boolean, default: false },
    fbUserId: { type: String },
    accessToken: { type: String },
    connectedPageId: { type: String },
  },
   permissions: [{  
    type: String,  
    enum: ['manage_users', 'edit_invoices', 'view_reports']
  }] 
});

module.exports = mongoose.model('Admin', adminSchema);
