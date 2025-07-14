const leadStatusSummary = async (Model, req, res) => {
  try {
    // Adjust these statuses as per your schema
    const statuses = [
      'New Lead',
      'Contacted',
      'Consultation Scheduled'
    ];

    // Aggregate counts for each status
    const pipeline = [
      { $match: { removed: false, enabled: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];

    const results = await Model.aggregate(pipeline);

    // Format for frontend
    const data = statuses.map(status => {
      const found = results.find(r => r._id === status);
      return { name: status, value: found ? found.count : 0 };
    });

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return res.status(200).json({
      success: true,
      result: { data, total },
      message: 'Lead status summary fetched successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message
    });
  }
};

module.exports = leadStatusSummary;