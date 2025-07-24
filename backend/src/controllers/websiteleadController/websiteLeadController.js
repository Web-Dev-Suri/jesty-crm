const Client = require('@/models/appModels/Client');

exports.receiveWebsiteLead = async (req, res) => {
  try {
    const { name, email, phone, ...rest } = req.body;

    // Save to Client model
    const client = await Client.create({
      name,
      email,
      phone,
      source: 'Website',
      ...rest,
      formResponses
    });

    res.status(201).json({ success: true, client });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};