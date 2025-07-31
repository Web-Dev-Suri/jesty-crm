const update = async (Model, req, res) => {
  // Enforce organizationId filter
  const orgFilter = req.user && req.user.organizationId ? { organizationId: req.user.organizationId } : {};
  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      ...orgFilter,
    },
    req.body,
    { new: true }
  )
    .populate()
    .exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'we update this document ',
    });
  }
};

module.exports = update;
