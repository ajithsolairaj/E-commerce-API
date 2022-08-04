function errorHandler(err, req, res, next) {
  if (err.name === "unauthorizedError") {
    return res.status(500).json({ message: "the user is not authorized" });
  }
  if (err.name === "validationError") {
    return res.status(500).json({ message: err });
  }
  return res.status(500).json(err);
}

module.exports = errorHandler;
