const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');

router.post('/', gymController.createGym);
router.get('/stats', gymController.getGymStats);
router.get('/:gymId', gymController.getGym);
router.put('/:gymId', gymController.updateGym);
router.get('/', gymController.searchGyms);

module.exports = router;
