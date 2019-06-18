const mongoose = require('mongoose');
const AssetData = require('./AssetData');
mongoose.Promise = global.Promise;

const AssetSchema = new mongoose.Schema({
  Exchange: String,
  Base: String,
  Quote: String
});

module.exports = mongoose.model('NewAsset2', AssetSchema);
