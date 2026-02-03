const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

const applicationController = require('../controllers/applicationController');

router.post('/', jobController.createJob);
router.put('/:jobId', jobController.updateJob);
router.patch('/:jobId/close', jobController.closeJob);
router.get('/:jobId', jobController.getJob);
router.get('/', jobController.searchJobs);
router.get('/:jobId/applications', applicationController.getJobApplications);

module.exports = router;
