const express = require('express');
const router = express.Router();
const verifyState = require('../middleware/verifyState');
const statesController = require('../controllers/statesController');

// GET all states (with optional contig filter)
router.get('/', statesController.getAllStates);

// GET all data for a specific state
router.get('/:state', verifyState, statesController.getState);

// GET a random fun fact
router.get('/:state/funfact', verifyState, statesController.getFunFact);

// POST new fun facts
router.post('/:state/funfact', verifyState, statesController.addFunFacts);

// PATCH a specific fun fact
router.patch('/:state/funfact', verifyState, statesController.updateFunFact);

// DELETE a specific fun fact
router.delete('/:state/funfact', verifyState, statesController.deleteFunFact);

// NEW GET routes
router.get('/:state/capital', verifyState, statesController.getCapital);
router.get('/:state/nickname', verifyState, statesController.getNickname);
router.get('/:state/population', verifyState, statesController.getPopulation);
router.get('/:state/admission', verifyState, statesController.getAdmission);

module.exports = router;
