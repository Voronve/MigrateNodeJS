const express = require('express');
const router = express.Router();
const { addData, createAsset, execQuery } = require('../controller/newAssetController');

router
  .route('/newAssets')
  .post(createAsset)
  .put(addData)
  .get(execQuery);

module.exports = router;
