const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Remove fields
  const removeFields = ['limit', 'page', 'select', 'sort'];

  // Loop overs removefields array and deletes them from the query
  removeFields.forEach((param) => delete reqQuery[param]);

  // String maninpulation in order to format the query string from the params in the mongodb acceptable manner for more visit: https://www.mongodb.com/docs/manual/reference/operator/query/gte/#mongodb-query-op.-gte
  let queryString = JSON.stringify(reqQuery); // Create query string

  // Create operators for gt, gte, lt, lte and in
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g, // regex for greater than, greater than equal to, less than, less than equal to and in
    (match) => `$${match}`
  );

  queryString = JSON.parse(queryString);
  // Finding the resource in the database
  query = model.find(queryString);
  //   .populate()
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;

  // Limit
  const limit = parseInt(req.query.limit, 10) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Execute the query
  const results = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.pre = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

export default advancedResults;
