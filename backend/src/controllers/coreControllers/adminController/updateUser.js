const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const user = await Admin.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};