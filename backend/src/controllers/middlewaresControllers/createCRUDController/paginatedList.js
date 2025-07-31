const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

  const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

  let fields;

  fields = fieldsArray.length === 0 ? {} : { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  let query = {
    removed: false,
    ...fields,
  };
  // Enforce organizationId filter
  if (req.user && req.user.organizationId) {
    query.organizationId = req.user.organizationId;
  }

  // Add this block for date range filtering
  if (req.query.created_gte || req.query.created_lte) {
    query.created = {};
    if (req.query.created_gte) query.created.$gte = new Date(req.query.created_gte);
    if (req.query.created_lte) query.created.$lte = new Date(req.query.created_lte);
    // Remove empty object if no values set
    if (Object.keys(query.created).length === 0) delete query.created;
  }

  if (filter && equal) {
    // Support comma-separated values for $in
    if (equal.includes(',')) {
      query[filter] = { $in: equal.split(',') };
    } else {
      query[filter] = equal;
    }
  }

  // Support multiple filters (e.g. status, assigned)
  if (req.query.status) {
    const statuses = req.query.status.split(',');
    query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
  }
  if (req.query.assigned) {
    const agents = req.query.assigned.split(',');
    query.assigned = agents.length > 1 ? { $in: agents } : agents[0];
  }

  //  Query the database for a list of all results
  const resultsPromise = Model.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortValue })
    .populate()
    .exec();

  // Counting the total documents
  const countPromise = Model.countDocuments({
    removed: false,

    [filter]: equal,
    ...fields,
  });
  // Resolving both promises
  const [result, count] = await Promise.all([resultsPromise, countPromise]);

  // Calculating total pages
  const pages = Math.ceil(count / limit);

  // Getting Pagination Object
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(200).json({
      success: true,
      result,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: true,
      result: [],
      pagination,
      message: 'Collection is Empty',
    });
  }
};

module.exports = paginatedList;
