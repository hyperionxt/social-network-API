export const schemaValidator = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json(err.errors.map((error) => error.message));
  }
};
