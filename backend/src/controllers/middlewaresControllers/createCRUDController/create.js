const create = async (Model, req, res) => {
  // Assign organizationId from req.user if present
  if (req.user && req.user.organizationId) {
    req.body.organizationId = req.user.organizationId;
  }
  req.body.removed = false;
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
