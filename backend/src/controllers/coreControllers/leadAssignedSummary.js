const leadAssignedSummary = async (Model, req, res) => {
  try {
    const pipeline = [
      { $match: { removed: false, enabled: true, organization } },
      {
        $group: {
          _id: '$assigned',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'admins', // collection name for Admin
          localField: '_id',
          foreignField: '_id',
          as: 'assignedUser'
        }
      },
      {
        $unwind: {
          path: '$assignedUser',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: { $ifNull: ['$assignedUser.name', 'Unassigned'] },
          value: '$count'
        }
      }
    ];

    const data = await Model.aggregate(pipeline);
    const total = Array.isArray(data)
      ? data.reduce((sum, item) => sum + (item.value || 0), 0)
      : 0;

    return res.status(200).json({
      success: true,
      result: { data, total },
      message: 'Lead assigned summary fetched successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      result: null,
      message: err.message
    });
  }
};

module.exports = leadAssignedSummary;