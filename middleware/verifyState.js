const statesData = require("../models/statesData.json");

const verifyState = (req, res, next) => {
  const param = req.params.state;
  if (!param) {
    return res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }

  const stateCode = param.toUpperCase();
  const found = statesData.find((state) => state.code === stateCode);

  if (!found) {
    return res.status(400).json({ message: "Invalid state abbreviation parameter" });
  }

  req.stateCode = stateCode;
  req.stateData = found;
  next();
};

module.exports = verifyState;
