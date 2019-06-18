const Asset = require('../models/Asset');
const { dateConditionOld } = require('../helper/helper');

exports.execQuery = async (req, res) => {
  const { exchange, base, quote, dateStart, dateFinish } = req.query;
  let condition = Object.assign(
    { Exchange: exchange, Base: base, Quote: quote },
    await dateConditionOld(dateStart, dateFinish)
  );

  await Asset.find(condition)
    .sort({ TimeStart: 1 })
    .then(asset => {
      res.status(200).json(asset);
    });
  /*.toArray((err, docs) => {
      res.status(200).json(docs);
    });*/
};

exports.addData = async (req, res) => {
  const {
    Exchange,
    Base,
    Quote,
    TimeStart,
    PriceOpen,
    PriceHigh,
    PriceLow,
    PriceClose,
    VolumeTraded,
    TradesCount,
    source
  } = req.body;
  let newAsset = new Asset({
    Exchange,
    Base,
    Quote,
    TimeStart,
    PriceOpen,
    PriceHigh,
    PriceLow,
    PriceClose,
    VolumeTraded,
    TradesCount,
    source
  });
  await newAsset.save();
  res.status(200).send(newAsset);
};
