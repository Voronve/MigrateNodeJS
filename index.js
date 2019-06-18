const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const oldRoutes = require('./router/assetRoutes');
const newRoutes = require('./router/newAssetRoutes');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dbFromDump', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Мы подключены!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(oldRoutes);
app.use(newRoutes);
const server = http.createServer(app);

console.log('port is working!');
server.listen(3000);
