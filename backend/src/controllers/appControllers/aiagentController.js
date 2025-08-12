const AIAgent = require('@/models/appModels/Aiagent');


exports.addAgent = async (req, res) => {
  try {
    const agent = new AIAgent({
      ...req.body,
      organizationId: req.user.organizationId,
      createdBy: req.user._id,
    });

    await agent.save();
    res.status(200).json({ success: true, agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Agent creation failed' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await AIAgent.find({
      organizationId: req.user.organizationId,
      removed: false,
    });

    res.status(200).json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch agents' });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    await AIAgent.findByIdAndUpdate(id, { removed: true });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete agent' });
  }
};
