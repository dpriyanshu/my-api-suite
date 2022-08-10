const mongoose = require("mongoose");
const data = require("./environment.js");
const Utils = require("./utils.js");

var DbUtils = {
  deleteRecords: async function (dbName, collection, mongoQuery) {
    var mongoHost = data.mongo_host.replace("env", await Utils.getEnv());
    await mongoose.connect(
      "mongodb://" + mongoHost + ":" + data.mongo_port + "/" + dbName,
      data.mongo_options
    );
    const db = mongoose.connection;
    let currentCollection = db.collection(collection);
    var removed = await currentCollection.deleteMany(mongoQuery);
    console.log("REMOVED: " + removed);
    db.close();
  },

  updateRecords: async function (dbName, collection, findQuery, setQuery) {
    var mongoHost = data.mongo_host.replace("env", await Utils.getEnv());
    await mongoose.connect(
      "mongodb://" + mongoHost + ":" + data.mongo_port + "/" + dbName,
      data.mongo_options
    );
    const db = mongoose.connection;
    let currentCollection = db.collection(collection);
    currentCollection.findOneAndUpdate(findQuery, setQuery);
    db.close();
  },
};
module.exports = DbUtils;
