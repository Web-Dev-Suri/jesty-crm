const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Organization = require('@/models/coreModels/Organization');

const signup = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password, name, organizationName } = req.body;

  // validate
  const objectSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: true } }).required(),
    password: Joi.string().min(6).required(),
    organizationName: Joi.string().required(),
  });

  const { error } = objectSchema.validate({ email, password, name, organizationName });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errorMessage: error.message,
    });
  }

  const existingUser = await UserModel.findOne({ email, removed: false });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered.',
    });
  }

  // Create organization
  const organization = await Organization.create({ name: organizationName });

  // Create user with organizationId
  const newUser = await UserModel.create({ name, email, enabled: true, organizationId: organization._id });

  // Hash and store password
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserPasswordModel.create({
    user: newUser._id,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    result: { id: newUser._id, email: newUser.email, organizationId: organization._id },
  });
};

module.exports = signup;