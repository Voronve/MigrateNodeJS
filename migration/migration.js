const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dbFromDump', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Мы подключены!');
});
const OldAsset = require('../models/Asset');
const NewAsset = require('../models/NewAsset');
const AssetData = require('../models/AssetData');

async function MigrateAssets() {
  /*Инициализируем переменную lastId объектом типа ObjectId с переданным 
  значением 0 для начального сравнения с первым id ассета в базе*/
  let lastId = new mongoose.Types.ObjectId(0);
  console.log('lastId 0f null', lastId);

  /* Будем выполнять операции пока lastId не равен null*/
  while (lastId !== null) {
    console.log(lastId);
    await OldAsset.find({ _id: { $gt: lastId } })
      .limit(50)
      .sort({ _id: 'asc' })
      .then(async assets => {
        //Проверка не достигли ли мы конца базы данных
        if (assets.length == 0) {
          lastId = null;
          return;
        }
        /*Для перебора элементов полученного массива данных можно
        использовать только цикл for of: forEach не подходит из-за
        разных контекстов выполнения итераций(они будут выполняться асинхронно!)*/

        for (asset of assets) {
          lastId = asset._id;
          console.log('lastId', lastId);

          //let Year = new Date(asset.TimeStart).getFullYear();

          let {
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
          } = asset;

          let AssetTypeObj = {
            Exchange,
            Base,
            Quote
          };

          const AssetDataObj = {
            AssetId: asset._id,
            TimeStart,
            PriceOpen,
            PriceHigh,
            PriceLow,
            PriceClose,
            VolumeTraded,
            TradesCount,
            source
          };
          await NewAsset.findOne(AssetTypeObj).then(async foundedAsset => {
            if (!foundedAsset) {
              console.log('Создаем новый ассет');
              const newAsset = await new NewAsset({ Exchange, Base, Quote }).save();
              AssetDataObj.AssetId = newAsset._id;
            } else {
              AssetDataObj.AssetId = foundedAsset._id;
            }
            let assetData = await new AssetData(AssetDataObj).save();
            console.log(assetData._id);
          });
        }
      })
      .then(() => {
        console.log('Limit is achived!');
      });
  }
  console.log('Данные были успешно переданы');
  process.exit(-1);
}

MigrateAssets();
