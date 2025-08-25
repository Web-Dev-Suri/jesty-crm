const leadCreatedPerDay = async (Model, req, res) => {
  try {
    // Set date range: past 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    // MongoDB aggregation
    const pipeline = [
      {
        $match: {
          removed: false,
          enabled: true,
          organization,
          created: {
            $gte: new Date(startDate.setHours(0, 0, 0, 0)),
            $lte: new Date(endDate.setHours(23, 59, 59, 999))
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const result = await Model.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      result,
      message: 'Leads created per day fetched successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message
    });
  }
};

module.exports = leadCreatedPerDay;
