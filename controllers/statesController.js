const State = require("../models/State");
const statesData = require("../models/statesData.json");

const getAllStates = async (req, res) => {
  const contig = req.query.contig;
  let results = statesData;

  if (contig === "true") {
    results = results.filter((state) => !["AK", "HI"].includes(state.code));
  } else if (contig === "false") {
    results = results.filter((state) => ["AK", "HI"].includes(state.code));
  }

  const dbStates = await State.find();
  const merged = results.map((state) => {
    const match = dbStates.find((db) => db.stateCode === state.code);
    return match ? { ...state, funfacts: match.funfacts } : state;
  });

  res.json(merged);
};

const getState = async (req, res) => {
  const { stateCode, stateData } = req;
  const match = await State.findOne({ stateCode });
  if (match && match.funfacts) {
    return res.json({ ...stateData, funfacts: match.funfacts });
  }
  res.json(stateData);
};

const getFunFact = async (req, res) => {
  const { stateCode, stateData } = req;
  const match = await State.findOne({ stateCode });
  if (!match || !match.funfacts || match.funfacts.length === 0) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateData.state}` });
  }

  const random =
    match.funfacts[Math.floor(Math.random() * match.funfacts.length)];
  res.json({ funfact: random });
};

const addFunFacts = async (req, res) => {
  const { funfacts } = req.body;
  const { stateCode, stateData } = req;

  if (!funfacts || !Array.isArray(funfacts)) {
    return res
      .status(400)
      .json({ message: "State fun facts value required and must be an array" });
  }

  const state = await State.findOneAndUpdate(
    { stateCode },
    { $push: { funfacts: { $each: funfacts } } },
    { new: true, upsert: true }
  );

  res.json(state);
};

const updateFunFact = async (req, res) => {
  const { index, funfact } = req.body;
  const { stateCode, stateData } = req;

  if (!index || !funfact) {
    return res
      .status(400)
      .json({ message: "State fun fact index and value required" });
  }

  const state = await State.findOne({ stateCode });
  if (!state || !state.funfacts || index < 1 || index > state.funfacts.length) {
    return res
      .status(404)
      .json({
        message: `No Fun Fact found at that index for ${stateData.state}`,
      });
  }

  state.funfacts[index - 1] = funfact;
  await state.save();
  res.json(state);
};

const deleteFunFact = async (req, res) => {
  const { index } = req.body;
  const { stateCode, stateData } = req;

  if (!index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }

  const state = await State.findOne({ stateCode });
  if (!state || !state.funfacts || index < 1 || index > state.funfacts.length) {
    return res
      .status(404)
      .json({
        message: `No Fun Fact found at that index for ${stateData.state}`,
      });
  }

  state.funfacts.splice(index - 1, 1);
  await state.save();
  res.json(state);
};

// NEW CONTROLLER FUNCTIONS

const getCapital = (req, res) => {
  const { stateData } = req;
  res.json({ state: stateData.state, capital: stateData.capital_city });
};

const getNickname = (req, res) => {
  const { stateData } = req;
  res.json({ state: stateData.state, nickname: stateData.nickname });
};

const getPopulation = (req, res) => {
  const { stateData } = req;
  res.json({ state: stateData.state, population: stateData.population });
};

const getAdmission = (req, res) => {
  const { stateData } = req;
  res.json({ state: stateData.state, admitted: stateData.admission_date });
};

module.exports = {
  getAllStates,
  getState,
  getFunFact,
  addFunFacts,
  updateFunFact,
  deleteFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission
};
