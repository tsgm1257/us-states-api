const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
  const code = req.params.state?.toUpperCase();
  const valid = statesData.find(state => state.code === code);

  if (!valid) {
    return res.status(404).json({ error: 'Invalid state abbreviation parameter' });
  }

  req.stateCode = code;
  req.stateData = valid;
  next();
};

module.exports = verifyState;
