const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const { execQuery, addData } = require('../controller/assetController');

router
  .route('/assets')
  .get(execQuery)
  .post(addData);

module.exports = router;
