const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.submitApplication);
router.get('/my-applications', applicationController.getMyApplications);
router.get('/:applicationId', applicationController.getApplication);
router.patch('/:applicationId', applicationController.updateApplicationStatus);

module.exports = router;
