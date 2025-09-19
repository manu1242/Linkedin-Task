const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');
const ctrl = require('../Controllers/ApplicationController');

router.post('/submit', upload.array('documents', 6), ctrl.submitApplication);
router.get('/my-status', ctrl.myApplications);
router.get('/pending', ctrl.pendingApplications); // admin filtered at controller
router.put('/:applicationId/review', ctrl.reviewApplication);

module.exports = router;