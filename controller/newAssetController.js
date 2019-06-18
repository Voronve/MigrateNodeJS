const mongoose = require('mongoose');
const Asset = require('../models/NewAsset');
const AssetData = require('../models/AssetData');
const { dateConditionOld } = require('../helper/helper');

exports.execQuery = async (req, res) => {
  let { Exchange, Base, Quote, dateStart, dateFinish } = req.query;

  //dateStart = dateStart ? dateStart.split(' ')[0] + '+' + dateStart.split(' ')[1] : null;
  //dateFinish = dateFinish ? dateFinish.split(' ')[0] + '+' + dateFinish.split(' ')[1] : null;

  console.log('dateStart', dateStart);
  console.log('dateFinish', dateFinish);

  let asset = {};

  await Asset.findOne({ Exchange, Base, Quote })
    .then(foundedAsset => {
      console.log('foundedAsset', foundedAsset);
      const assetId = foundedAsset._id;
      asset = {
        Exchange: foundedAsset.Exchange,
        Base: foundedAsset.Base,
        Quote: foundedAsset.Quote
      };
      return assetId;
    })
    .then(async AssetId => {
      console.log('AssetId', AssetId);
      let condition = Object.assign({ AssetId }, dateConditionOld(dateStart, dateFinish));
      asset.Data = await AssetData.find(condition).sort({ TimeStart: 'asc' });
    });
  console.log('asset', asset);
  res.status(200).send(asset);
};

exports.createAsset = async (req, res) => {
  let { Exchange, Base, Quote, Year } = req.body;

  Year = Year ? Year : new Date().getFullYear();

  let foundedAsset = await Asset.findOne({ Year, Exchange, Base, Quote });

  if (!foundedAsset) {
    let newAsset = new Asset({ Exchange, Base, Quote, Year });
    await newAsset.save();
    return res.status(200).send(newAsset);
  }

  res.status(200).send('Such asset is already exist!');
};

exports.addData = async (req, res) => {
  const { Exchange, Base, Quote } = req.query;
  const { PriceOpen, PriceHigh, PriceLow, PriceClose, VolumeTraded, TradesCount, source } = req.body;
  const TimeStart = req.body.TimeStart ? req.body.TimeStart : Date.now();
  console.log('TimeStart', TimeStart);

  const AssetDataObj = {
    TimeStart,
    PriceOpen,
    PriceHigh,
    PriceLow,
    PriceClose,
    VolumeTraded,
    TradesCount,
    source
  };

  const AssetTypeObj = {
    Exchange,
    Base,
    Quote
  };

  Asset.findOne(AssetTypeObj)
    .then(async foundedAsset => {
      if (!foundedAsset) {
        console.log('Создаем новый ассет');
        const newAsset = await new Asset({ Exchange, Base, Quote }).save();
        AssetDataObj.AssetId = newAsset._id;
        console.log('AssetDataObj', AssetDataObj);
      } else {
        console.log('Обновляем существующий ассет');
        AssetDataObj.AssetId = foundedAsset._id;
        console.log('foundedAsset', foundedAsset);
        console.log('AssetDataObj', AssetDataObj);
      }
      return AssetDataObj;
    })
    .then(async DataObj => {
      let assetData = await new AssetData(DataObj).save();

      res.status(200).send(assetData);
    });
};
