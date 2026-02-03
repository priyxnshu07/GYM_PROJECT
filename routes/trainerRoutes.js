const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.post('/profile', trainerController.createProfile);
router.put('/profile', trainerController.updateProfile);
router.get('/:trainerId', trainerController.getTrainerProfile);
router.get('/', trainerController.searchTrainers);

module.exports = router;
