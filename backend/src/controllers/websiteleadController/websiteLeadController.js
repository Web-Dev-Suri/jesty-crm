const Client = require('@/models/appModels/Client');

exports.receiveWebsiteLead = async (req, res) => {
  try {
    const { name, email, phone, ...rest } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      source: 'Website',
      formResponses: rest,
    });

    res.status(201).json({ success: true, client });
  } catch (err) {
    console.error('[receiveWebsiteLead]', err);
    res.status(400).json({ success: false, message: err.message });
  }
};
