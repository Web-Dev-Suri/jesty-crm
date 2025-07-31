const remove = async (Model, req, res) => {
  // Enforce organizationId filter
  const orgFilter = req.user && req.user.organizationId ? { organizationId: req.user.organizationId } : {};
  const result = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      ...orgFilter,
    },
    { removed: true },
    { new: true }
  )
    .populate()
    .exec();
  // If no results found, return document not found
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
      message: 'Successfully Deleted the document ',
    });
  }
};

module.exports = remove;
