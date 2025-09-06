// db.js

const mongoose = require('mongoose');

//const dbURI = 'mongodb+srv://ahmedadeel164722:20020Chand@cluster0.nx4zcye.mongodb.net/assoonaspossible?retryWrites=true&w=majority'; 
const dbURI = 'mongodb://sylvie:12345@ac-gdfo2aq-shard-00-00.2sihurs.mongodb.net:27017,ac-gdfo2aq-shard-00-01.2sihurs.mongodb.net:27017,ac-gdfo2aq-shard-00-02.2sihurs.mongodb.net:27017/?ssl=true&replicaSet=atlas-cp6vfk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'; 
// const dbURI = 'mongodb+srv://eservices908:u0jn1XgFubvsPyIB@asap-cluster.mlctjlz.mongodb.net/?retryWrites=true&w=majority&appName=ASAP-Cluster'; 
// const dbURI = 'mongodb+srv://eservices908:u0jn1XgFubvsPyIB@asap-cluster.mlctjlz.mongodb.net/ASAP?retryWrites=true&w=majority&appName=ASAP-Cluster';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnection = mongoose.connection;

dbConnection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

dbConnection.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = dbConnection;