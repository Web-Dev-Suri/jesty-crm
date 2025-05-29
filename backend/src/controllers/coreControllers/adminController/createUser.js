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

    // Create user with role 'user'
    const user = await Admin.create({ name, email, role: 'user', enabled: true });

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