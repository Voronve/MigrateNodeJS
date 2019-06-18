const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AssetData = new mongoose.Schema({
  AssetId: mongoose.Schema.Types.ObjectId,
  TimeStart: { type: Date, default: Date.now },
  PriceOpen: Number,
  PriceHigh: Number,
  PriceLow: Number,
  PriceClose: Number,
  VolumeTraded: Number,
  TradesCount: Number,
  source: String
});
module.exports = mongoose.model('AssetData', AssetData);
