const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const AdminPassword = mongoose.model('AdminPassword');
const { generate: uniqueId } = require('shortid');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Missing fields' });

    // Get organizationId from the authenticated admin
    const organizationId = req.user && req.user.organizationId;
    if (!organizationId) {
      return res.status(400).json({ success: false, message: 'Organization ID missing from user context' });
    }

    // Create user with role 'user' and organizationId
    const user = await Admin.create({ name, email, role: 'user', enabled: true, organizationId });

    // Create password entry
    const salt = uniqueId();
    const passwordHash = bcrypt.hashSync(salt + password);
    await AdminPassword.create({
      user: user._id,
      password: passwordHash,
      salt,
      emailVerified: true,
    });

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};