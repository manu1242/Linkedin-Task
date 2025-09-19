const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/ConnectionController');

router.get('/my-network', ctrl.myNetwork);
router.post('/request', ctrl.requestConnection);
router.put('/:connectionId', ctrl.updateConnection);
router.get('/suggestions', ctrl.suggestions);

module.exports = router;