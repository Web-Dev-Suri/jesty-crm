const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Admin.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};