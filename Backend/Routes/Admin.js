const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminController');
router.get('/application/pending',AdminController.pendingApplications)
router.get('/users',AdminController.listUsers);
router.get('/put',AdminController.suspendUser);
router.get('/stats',AdminController.stats);
module.exports = router