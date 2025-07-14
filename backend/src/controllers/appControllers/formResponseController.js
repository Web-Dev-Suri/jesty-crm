const FormResponse = require('@/models/appModels/FormResponse');

// Create a new form response
exports.create = async (req, res) => {
  try {
    const formResponse = await FormResponse.create(req.body);
    res.status(201).json({ success: true, result: formResponse });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all form responses for a client
exports.listByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const responses = await FormResponse.find({ clientId }).sort({ submittedAt: -1 });
    res.json({ success: true, result: responses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get a single form response by ID
exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await FormResponse.findById(id);
    if (!response) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, result: response });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};