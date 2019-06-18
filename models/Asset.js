const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AssetSchema = new mongoose.Schema({
  Exchange: String,
  Base: String,
  Quote: String,
  TimeStart: { type: Date, default: Date.now },
  PriceOpen: Number,
  PriceHigh: Number,
  PriceLow: Number,
  PriceClose: Number,
  VolumeTraded: Number,
  TradesCount: Number,
  source: String
});

module.exports = mongoose.model('ohlc_1m', AssetSchema, 'ohlc_1m');
